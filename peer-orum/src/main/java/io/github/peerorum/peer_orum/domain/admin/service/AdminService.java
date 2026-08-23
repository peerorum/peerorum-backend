package io.github.peerorum.peer_orum.domain.admin.service;

import io.github.peerorum.peer_orum.domain.admin.dto.AdminDashboardResponse;
import io.github.peerorum.peer_orum.domain.admin.dto.AdminSuspensionDto;
import io.github.peerorum.peer_orum.domain.admin.dto.AdminSuspensionListResponse;
import io.github.peerorum.peer_orum.domain.admin.dto.AdminUserDto;
import io.github.peerorum.peer_orum.domain.admin.dto.AdminUserResponse;
import io.github.peerorum.peer_orum.domain.admin.dto.AdminVerificationDto;
import io.github.peerorum.peer_orum.domain.admin.dto.AdminVerificationListResponse;
import io.github.peerorum.peer_orum.domain.spec.entity.Activity;
import io.github.peerorum.peer_orum.domain.spec.entity.Certificate;
import io.github.peerorum.peer_orum.domain.spec.repository.ActivityRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.CertificateRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.SpecProfileRepository;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SpecProfileRepository specProfileRepository;
    private final CertificateRepository certificateRepository;
    private final ActivityRepository activityRepository;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStatistics() {
        long totalUsers = userRepository.count();
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        long newSignups = userRepository.countByCreatedAtAfter(startOfDay);
        long totalSpecCards = specProfileRepository.count();
        
        List<User> recentUsers = userRepository.findTop5ByOrderByCreatedAtDesc();
        List<AdminDashboardResponse.RecentSignupDto> recentSignups = recentUsers.stream()
                .map(user -> AdminDashboardResponse.RecentSignupDto.builder()
                        .name(user.getName() != null ? user.getName() : "익명")
                        .handle(user.getVirtualNickname())
                        .time(formatTimeAgo(user.getCreatedAt()))
                        .build())
                .collect(Collectors.toList());

        List<AdminDashboardResponse.SignupTrendDto> trend = List.of(
                new AdminDashboardResponse.SignupTrendDto("08/01", 120),
                new AdminDashboardResponse.SignupTrendDto("08/02", 180),
                new AdminDashboardResponse.SignupTrendDto("08/03", 250),
                new AdminDashboardResponse.SignupTrendDto("08/04", 210),
                new AdminDashboardResponse.SignupTrendDto("08/05", 320),
                new AdminDashboardResponse.SignupTrendDto("08/06", 280),
                new AdminDashboardResponse.SignupTrendDto(LocalDate.now().format(DateTimeFormatter.ofPattern("MM/dd")), (int)newSignups + 150)
        );

        List<AdminDashboardResponse.GenderDistributionDto> gender = List.of(
                new AdminDashboardResponse.GenderDistributionDto("남성", 45, "#2563EB"),
                new AdminDashboardResponse.GenderDistributionDto("여성", 52, "#60A5FA"),
                new AdminDashboardResponse.GenderDistributionDto("미기재", 3, "#E5E7EB")
        );

        List<AdminDashboardResponse.RecentReportDto> reports = List.of(
                new AdminDashboardResponse.RecentReportDto("REP-2024-001", "허위 스펙 의심", "존재하지 않는 자격증 등록", "2024.08.18", "대기"),
                new AdminDashboardResponse.RecentReportDto("REP-2024-002", "비속어 사용", "프로필 소개에 부적절한 단어 포함", "2024.08.17", "처리완료")
        );

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .newSignups(newSignups)
                .totalSpecCards(totalSpecCards)
                .reportCount(reports.size())
                .recentSignups(recentSignups)
                .signupTrend(trend)
                .genderDistribution(gender)
                .recentReports(reports)
                .build();
    }

    @Transactional(readOnly = true)
    public AdminUserResponse getUsers(Pageable pageable) {
        Page<User> userPage = userRepository.findAll(pageable);

        List<AdminUserDto> userDtos = userPage.getContent().stream()
                .map(user -> {
                    // For now, mapping basic user info. Real implementation should join with SchoolAuth/SpecProfile for school/major.
                    return AdminUserDto.builder()
                            .id(user.getVirtualNickname())
                            .name(user.getName() != null ? user.getName() : "익명")
                            .school("미등록") // To be fetched from SchoolAuth or SpecProfile
                            .major("미등록") // To be fetched from SpecProfile
                            .grade("-")
                            .joinedAt(user.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
                            .status(user.getRole().name().equals("ROLE_USER") ? "활성" : "대기")
                            .verified("인증대기") // Logic for verification status
                            .build();
                })
                .collect(Collectors.toList());

        return AdminUserResponse.builder()
                .users(userDtos)
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .currentPage(userPage.getNumber())
                .build();
    }

    private String formatTimeAgo(LocalDateTime createdAt) {
        if (createdAt == null) return "방금 전";
        long minutes = ChronoUnit.MINUTES.between(createdAt, LocalDateTime.now());
        if (minutes < 60) return minutes + "분 전";
        long hours = ChronoUnit.HOURS.between(createdAt, LocalDateTime.now());
        if (hours < 24) return hours + "시간 전";
        long days = ChronoUnit.DAYS.between(createdAt, LocalDateTime.now());
        return days + "일 전";
    }

    @Transactional(readOnly = true)
    public AdminVerificationListResponse getVerifications() {
        List<Certificate> certs = certificateRepository.findAll();
        List<Activity> acts = activityRepository.findAll();

        List<AdminVerificationDto> dtos = new ArrayList<>();

        for (Certificate c : certs) {
            String name = c.getUser() != null && c.getUser().getName() != null ? c.getUser().getName() : "익명";
            String handle = c.getUser() != null && c.getUser().getVirtualNickname() != null ? c.getUser().getVirtualNickname() : "unknown";
            String submittedAt = c.getCreatedAt() != null ? c.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : "N/A";
            String status = c.getStatus().name().equals("PENDING") ? "대기 중" :
                            c.getStatus().name().equals("VERIFIED") ? "처리 완료" : "거절됨";

            dtos.add(AdminVerificationDto.builder()
                    .id("C" + c.getId())
                    .name(name)
                    .handle(handle)
                    .type("자격증 (" + c.getCertName() + ")")
                    .file(c.getFileUrl() != null ? c.getFileUrl() : "파일없음")
                    .submittedAt(submittedAt)
                    .status(status)
                    .build());
        }

        for (Activity a : acts) {
            String name = a.getUser() != null && a.getUser().getName() != null ? a.getUser().getName() : "익명";
            String handle = a.getUser() != null && a.getUser().getVirtualNickname() != null ? a.getUser().getVirtualNickname() : "unknown";
            String submittedAt = a.getCreatedAt() != null ? a.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : "N/A";
            String status = a.getStatus().name().equals("PENDING") ? "대기 중" :
                            a.getStatus().name().equals("VERIFIED") ? "처리 완료" : "거절됨";

            dtos.add(AdminVerificationDto.builder()
                    .id("A" + a.getId())
                    .name(name)
                    .handle(handle)
                    .type("대외활동 (" + a.getActivityName() + ")")
                    .file(a.getFileUrl() != null ? a.getFileUrl() : "파일없음")
                    .submittedAt(submittedAt)
                    .status(status)
                    .build());
        }

        dtos.sort((d1, d2) -> d2.getSubmittedAt().compareTo(d1.getSubmittedAt()));

        return AdminVerificationListResponse.builder()
                .verifications(dtos)
                .totalElements(dtos.size())
                .build();
    }

    @Transactional(readOnly = true)
    public AdminSuspensionListResponse getSuspensions() {
        List<AdminSuspensionDto> dtos = List.of(
                new AdminSuspensionDto("minjun_kim", "김민준", "서울대학교", "정지", "부적절한 게시글", "2024.08.19 14:32", "대기 중"),
                new AdminSuspensionDto("seoyeon_lee", "이서연", "연세대학교", "정지", "허위 정보 등록", "2024.08.19 13:18", "처리 완료"),
                new AdminSuspensionDto("jihoon_park", "박지훈", "고려대학교", "탈퇴", "서비스 이용 중단", "2024.08.19 11:47", "검토 중"),
                new AdminSuspensionDto("subin_choi", "최수빈", "성균관대학교", "탈퇴", "개인정보 우려", "2024.08.19 10:22", "대기 중"),
                new AdminSuspensionDto("woosung_jung", "정우성", "한양대학교", "정지", "부적절한 게시글", "2024.08.19 09:15", "처리 완료")
        );

        return AdminSuspensionListResponse.builder()
                .suspensions(dtos)
                .totalElements(dtos.size())
                .build();
    }
}
