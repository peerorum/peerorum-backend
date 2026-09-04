package io.github.peerorum.peer_orum.domain.comparison.service;

import io.github.peerorum.peer_orum.domain.comparison.dto.ComparisonStatisticsResponse;
import io.github.peerorum.peer_orum.domain.comparison.dto.SpecProfileResponse;
import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import io.github.peerorum.peer_orum.domain.spec.repository.SpecProfileRepository;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import io.github.peerorum.peer_orum.domain.comparison.dto.ProfileDetailResponse;
import io.github.peerorum.peer_orum.domain.spec.entity.Activity;
import io.github.peerorum.peer_orum.domain.spec.entity.Certificate;
import io.github.peerorum.peer_orum.domain.spec.repository.ActivityRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.CertificateRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.InternRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.AwardRepository;
import io.github.peerorum.peer_orum.domain.spec.entity.Intern;
import io.github.peerorum.peer_orum.domain.spec.entity.Award;

@RequiredArgsConstructor
@Service
public class ComparisonService {

    private final SpecProfileRepository specProfileRepository;
    private final UserRepository userRepository;
    private final CertificateRepository certificateRepository;
    private final ActivityRepository activityRepository;
    private final InternRepository internRepository;
    private final AwardRepository awardRepository;

    @Transactional(readOnly = true)
    public ComparisonStatisticsResponse getComparisonStatistics(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        SpecProfile myProfile = specProfileRepository.findByUser(user)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "Spec profile not found for user"));

        // 동질 집단 쿼리 (같은 학교, 학과, 학년, 희망직무) - MVP 단순화를 위해 조건 중 일부를 파라미터화할 수도 있지만 일단 일치하는 조건 검색
        List<SpecProfile> peers = specProfileRepository.findPeers(
                myProfile.getUniversity(),
                myProfile.getMajor(),
                myProfile.getEntranceYear(),
                myProfile.getDesiredJob()
        );

        if (peers.isEmpty()) {
            return ComparisonStatisticsResponse.builder()
                    .totalPeers(0)
                    .build();
        }

        double totalGpa = 0.0;
        double totalToeic = 0.0;
        int toeicCount = 0;
        int rank = 1;

        for (SpecProfile peer : peers) {
            if (peer.getGpa() != null) {
                totalGpa += peer.getGpa();
                // 백분위 계산을 위해 순위 책정 (내림차순 정렬되어 있다고 가정 - CustomRepository에서 처리)
                if (peer.getGpa() > (myProfile.getGpa() != null ? myProfile.getGpa() : 0.0)) {
                    rank++;
                }
            }
            if (peer.getToeicScore() != null) {
                totalToeic += peer.getToeicScore();
                toeicCount++;
            }
        }

        double averageGpa = totalGpa / peers.size();
        double averageToeic = toeicCount > 0 ? totalToeic / toeicCount : 0.0;
        
        // 백분위 계산 (0~100) : (전체 인원 - 등수) / 전체 인원 * 100
        double percentile = peers.size() > 1 ? (double)(peers.size() - rank) / (peers.size() - 1) * 100 : 100.0;

        List<SpecProfileResponse> peerResponses = peers.stream()
                .map(p -> {
                    int certs = certificateRepository.findByUser(p.getUser()).size();
                    int interns = internRepository.findByUser(p.getUser()).size();
                    int activities = activityRepository.findByUser(p.getUser()).size();
                    return SpecProfileResponse.of(p, certs, interns, activities);
                })
                .collect(Collectors.toList());

        return ComparisonStatisticsResponse.builder()
                .totalPeers(peers.size())
                .averageGpa(Math.round(averageGpa * 100.0) / 100.0)
                .averageToeic(Math.round(averageToeic * 10.0) / 10.0)
                .myGpaPercentile(Math.round(percentile * 100.0) / 100.0)
                .peerProfiles(peerResponses)
                .build();
    }

    public ProfileDetailResponse getProfileDetail(String anonymousUuid) {
        User targetUser = userRepository.findByAnonymousUuid(anonymousUuid)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "Target user not found"));

        SpecProfile targetProfile = specProfileRepository.findByUser(targetUser)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "Target profile not found"));

        List<Certificate> certs = certificateRepository.findByUser(targetUser);
        List<Activity> activities = activityRepository.findByUser(targetUser);
        List<Intern> interns = internRepository.findByUser(targetUser);
        List<Award> awards = awardRepository.findByUser(targetUser);

        return ProfileDetailResponse.builder()
                .anonymousUuid(targetUser.getAnonymousUuid())
                .virtualNickname(targetUser.getVirtualNickname())
                .university(targetProfile.getUniversity())
                .major(targetProfile.getMajor())
                .entranceYear(targetProfile.getEntranceYear())
                .desiredJob(targetProfile.getDesiredJob())
                .gpa(targetProfile.getGpa())
                .toeicScore(targetProfile.getToeicScore())
                .certificates(certs.stream().map(ProfileDetailResponse.CertificateDto::from).collect(Collectors.toList()))
                .activities(activities.stream().map(ProfileDetailResponse.ActivityDto::from).collect(Collectors.toList()))
                .interns(interns.stream().map(ProfileDetailResponse.InternDto::from).collect(Collectors.toList()))
                .awards(awards.stream().map(ProfileDetailResponse.AwardDto::from).collect(Collectors.toList()))
                .build();
    }

    @Transactional(readOnly = true)
    public List<SpecProfileResponse> searchPeers(String university, String major, Integer entranceYear, String desiredJob, Double minGpa, Double maxGpa) {
        List<SpecProfile> peers = specProfileRepository.searchPeers(university, major, entranceYear, desiredJob, minGpa, maxGpa);
        return peers.stream()
                .map(p -> {
                    int certs = certificateRepository.findByUser(p.getUser()).size();
                    int interns = internRepository.findByUser(p.getUser()).size();
                    int activities = activityRepository.findByUser(p.getUser()).size();
                    return SpecProfileResponse.of(p, certs, interns, activities);
                })
                .collect(Collectors.toList());
    }
}
