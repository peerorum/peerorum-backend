package io.github.peerorum.peer_orum.domain.admin.service;

import io.github.peerorum.peer_orum.domain.admin.dto.*;
import io.github.peerorum.peer_orum.domain.admin.entity.*;
import io.github.peerorum.peer_orum.domain.admin.repository.AccountActionRequestRepository;
import io.github.peerorum.peer_orum.domain.auth.repository.RefreshTokenRepository;
import io.github.peerorum.peer_orum.domain.spec.entity.*;
import io.github.peerorum.peer_orum.domain.spec.repository.*;
import io.github.peerorum.peer_orum.domain.user.entity.*;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class AdminService {
    private static final DateTimeFormatter DATE=DateTimeFormatter.ofPattern("yyyy.MM.dd"), DATE_TIME=DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");
    private final UserRepository userRepository;
    private final SpecProfileRepository specProfileRepository;
    private final CertificateRepository certificateRepository;
    private final ActivityRepository activityRepository;
    private final AccountActionRequestRepository accountActionRequestRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional(readOnly=true)
    public AdminDashboardResponse getDashboardStatistics() {
        long total=userRepository.count(), today=userRepository.countByCreatedAtAfter(LocalDate.now().atStartOfDay());
        var recent=userRepository.findTop5ByOrderByCreatedAtDesc().stream().map(u->AdminDashboardResponse.RecentSignupDto.builder().name(value(u.getName(),"익명")).handle(u.getVirtualNickname()).time(formatTimeAgo(u.getCreatedAt())).build()).toList();
        return AdminDashboardResponse.builder().totalUsers(total).newSignups(today).totalSpecCards(specProfileRepository.count()).reportCount(0).recentSignups(recent).signupTrend(List.of()).genderDistribution(List.of()).recentReports(List.of()).build();
    }

    @Transactional(readOnly=true)
    public AdminUserResponse getUsers(Pageable pageable,String keyword,String status,Boolean verified,Integer joinedWithinDays) {
        Map<Long,SpecProfile> profiles=profiles(); Set<Long> verifiedIds=verifiedIds();
        String q=keyword==null?"":keyword.trim().toLowerCase(Locale.ROOT); AccountStatus wanted=parseStatus(status);
        LocalDateTime after=joinedWithinDays==null?null:LocalDateTime.now().minusDays(joinedWithinDays);
        List<User> filtered=userRepository.findAll().stream().filter(u->{ SpecProfile p=profiles.get(u.getId()); return (q.isBlank()||contains(u.getName(),q)||contains(u.getEmail(),q)||contains(u.getVirtualNickname(),q)||(p!=null&&(contains(p.getUniversity(),q)||contains(p.getMajor(),q))))&&(wanted==null||normalized(u)==wanted)&&(verified==null||verifiedIds.contains(u.getId())==verified)&&(after==null||(u.getCreatedAt()!=null&&!u.getCreatedAt().isBefore(after))); }).sorted(Comparator.comparing(User::getCreatedAt,Comparator.nullsLast(Comparator.reverseOrder()))).toList();
        int size=Math.max(1,pageable.getPageSize()), from=Math.min(pageable.getPageNumber()*size,filtered.size()), to=Math.min(from+size,filtered.size());
        List<AdminUserDto> rows=filtered.subList(from,to).stream().map(u->{ SpecProfile p=profiles.get(u.getId()); return AdminUserDto.builder().id(u.getVirtualNickname()).name(value(u.getName(),"익명")).school(p==null?"미등록":value(p.getUniversity(),"미등록")).major(p==null?"미등록":value(p.getMajor(),"미등록")).grade(grade(p)).joinedAt(u.getCreatedAt()==null?"-":u.getCreatedAt().format(DATE)).status(accountLabel(normalized(u))).verified(verifiedIds.contains(u.getId())?"인증완료":"인증대기").build(); }).toList();
        List<User> all=userRepository.findAll();
        return AdminUserResponse.builder().users(rows).totalElements(filtered.size()).totalPages((int)Math.ceil((double)filtered.size()/size)).currentPage(pageable.getPageNumber()).totalActive(all.stream().filter(User::isActive).count()).totalSuspended(all.stream().filter(u->normalized(u)==AccountStatus.SUSPENDED).count()).totalWithdrawn(all.stream().filter(u->normalized(u)==AccountStatus.WITHDRAWN).count()).build();
    }

    @Transactional(readOnly=true)
    public AdminVerificationListResponse getVerifications(String keyword,String status) {
        String q=keyword==null?"":keyword.trim().toLowerCase(Locale.ROOT); List<AdminVerificationDto> all=new ArrayList<>();
        certificateRepository.findAll().forEach(c->all.add(verification("C"+c.getId(),c.getUser(),"자격증 ("+c.getCertName()+")",c.getFileUrl(),c.getCreatedAt(),c.getStatus())));
        activityRepository.findAll().forEach(a->all.add(verification("A"+a.getId(),a.getUser(),"대외활동 ("+a.getActivityName()+")",a.getFileUrl(),a.getCreatedAt(),a.getStatus())));
        var rows=all.stream().filter(v->(q.isBlank()||contains(v.getName(),q)||contains(v.getHandle(),q)||contains(v.getType(),q))&&(status==null||status.isBlank()||status.equals("all")||status.equals(v.getStatus()))).sorted(Comparator.comparing(AdminVerificationDto::getSubmittedAt).reversed()).toList();
        return AdminVerificationListResponse.builder().verifications(rows).totalElements(rows.size()).build();
    }

    @Transactional public void decideVerification(String requestId,String decision) {
        VerificationStatus next="VERIFIED".equalsIgnoreCase(decision)?VerificationStatus.VERIFIED:"REJECTED".equalsIgnoreCase(decision)?VerificationStatus.REJECTED:null;
        if(next==null||requestId==null||requestId.length()<2) throw new IllegalArgumentException("잘못된 처리 요청입니다."); Long id=Long.valueOf(requestId.substring(1));
        if(requestId.startsWith("C")) certificateRepository.findById(id).orElseThrow(()->new IllegalArgumentException("인증 요청을 찾을 수 없습니다.")).updateStatus(next);
        else if(requestId.startsWith("A")) activityRepository.findById(id).orElseThrow(()->new IllegalArgumentException("인증 요청을 찾을 수 없습니다.")).updateStatus(next); else throw new IllegalArgumentException("지원하지 않는 인증 유형입니다.");
    }

    @Transactional(readOnly=true)
    public AdminSuspensionListResponse getSuspensions(String keyword,String type,String status) {
        Map<Long,SpecProfile> profiles=profiles(); String q=keyword==null?"":keyword.trim().toLowerCase(Locale.ROOT);
        var rows=accountActionRequestRepository.findAll().stream().map(r->{ User u=r.getUser(); SpecProfile p=profiles.get(u.getId()); return AdminSuspensionDto.builder().id(r.getId().toString()).name(value(u.getName(),"익명")).school(p==null?"미등록":value(p.getUniversity(),"미등록")).type(r.getType()==AccountActionType.SUSPENSION?"정지":"탈퇴").reason(r.getReason()).requestedAt(r.getCreatedAt()==null?"-":r.getCreatedAt().format(DATE_TIME)).status(actionLabel(r.getStatus())).build(); }).filter(v->(q.isBlank()||contains(v.getName(),q)||contains(v.getSchool(),q)||contains(v.getReason(),q))&&(type==null||type.isBlank()||type.equals("all")||type.equals(v.getType()))&&(status==null||status.isBlank()||status.equals("all")||status.equals(v.getStatus()))).sorted(Comparator.comparing(AdminSuspensionDto::getRequestedAt).reversed()).toList();
        return AdminSuspensionListResponse.builder().suspensions(rows).totalElements(rows.size()).build();
    }

    @Transactional public Long createAccountAction(AccountActionCreateRequest req){ User u=userRepository.findById(req.userId()).orElseThrow(()->new IllegalArgumentException("사용자를 찾을 수 없습니다.")); if(u.getRole()==Role.ROLE_ADMIN) throw new IllegalArgumentException("관리자 계정에는 요청을 만들 수 없습니다."); if(req.reason()==null||req.reason().isBlank()) throw new IllegalArgumentException("사유를 입력해주세요."); AccountActionType t=AccountActionType.valueOf(req.type().trim().toUpperCase(Locale.ROOT)); return accountActionRequestRepository.save(AccountActionRequest.builder().user(u).type(t).reason(req.reason().trim()).build()).getId(); }
    @Transactional public void decideAccountAction(Long id,String decision,String reviewer){ AccountActionRequest r=accountActionRequestRepository.findById(id).orElseThrow(()->new IllegalArgumentException("요청을 찾을 수 없습니다.")); AccountActionStatus next="APPROVED".equalsIgnoreCase(decision)?AccountActionStatus.APPROVED:"REJECTED".equalsIgnoreCase(decision)?AccountActionStatus.REJECTED:null; if(next==null) throw new IllegalArgumentException("잘못된 결정 값입니다."); r.decide(next,reviewer); if(next==AccountActionStatus.APPROVED){ r.getUser().updateAccountStatus(r.getType()==AccountActionType.SUSPENSION?AccountStatus.SUSPENDED:AccountStatus.WITHDRAWN); refreshTokenRepository.deleteByUser(r.getUser()); } }

    private Map<Long,SpecProfile> profiles(){ return specProfileRepository.findAll().stream().collect(Collectors.toMap(p->p.getUser().getId(),Function.identity(),(a,b)->a)); }
    private Set<Long> verifiedIds(){ Set<Long> ids=new HashSet<>(); certificateRepository.findAll().stream().filter(c->c.getStatus()==VerificationStatus.VERIFIED).map(Certificate::getUser).filter(Objects::nonNull).map(User::getId).forEach(ids::add); activityRepository.findAll().stream().filter(a->a.getStatus()==VerificationStatus.VERIFIED).map(Activity::getUser).filter(Objects::nonNull).map(User::getId).forEach(ids::add); return ids; }
    private AdminVerificationDto verification(String id,User u,String type,String file,LocalDateTime time,VerificationStatus status){ return AdminVerificationDto.builder().id(id).name(u==null?"익명":value(u.getName(),"익명")).handle(u==null?"unknown":value(u.getVirtualNickname(),"unknown")).type(type).file(value(file,"파일없음")).submittedAt(time==null?"-":time.format(DATE_TIME)).status(status==VerificationStatus.VERIFIED?"처리 완료":status==VerificationStatus.REJECTED?"거절됨":"대기 중").build(); }
    private AccountStatus parseStatus(String s){ return s==null||s.isBlank()||s.equals("all")?null:AccountStatus.valueOf(s.toUpperCase(Locale.ROOT)); }
    private AccountStatus normalized(User u){ return u.getAccountStatus()==null?AccountStatus.ACTIVE:u.getAccountStatus(); }
    private String accountLabel(AccountStatus s){ return switch(s){case ACTIVE->"활성";case SUSPENDED->"정지";case WITHDRAWN->"탈퇴";}; }
    private String actionLabel(AccountActionStatus s){ return switch(s){case PENDING->"대기 중";case APPROVED->"승인됨";case REJECTED->"거절됨";}; }
    private String grade(SpecProfile p){ if(p==null||p.getEntranceYear()==null)return "-"; return Math.max(1,Math.min(4,LocalDate.now().getYear()-p.getEntranceYear()+1))+"학년"; }
    private String value(String s,String fallback){ return s==null||s.isBlank()?fallback:s; }
    private boolean contains(String s,String q){ return s!=null&&s.toLowerCase(Locale.ROOT).contains(q); }
    private String formatTimeAgo(LocalDateTime t){ if(t==null)return "방금 전"; long m=ChronoUnit.MINUTES.between(t,LocalDateTime.now()); if(m<60)return m+"분 전"; long h=ChronoUnit.HOURS.between(t,LocalDateTime.now()); if(h<24)return h+"시간 전"; return ChronoUnit.DAYS.between(t,LocalDateTime.now())+"일 전"; }
}
