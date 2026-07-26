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

@RequiredArgsConstructor
@Service
public class ComparisonService {

    private final SpecProfileRepository specProfileRepository;
    private final UserRepository userRepository;

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
                .map(SpecProfileResponse::from)
                .collect(Collectors.toList());

        return ComparisonStatisticsResponse.builder()
                .totalPeers(peers.size())
                .averageGpa(Math.round(averageGpa * 100.0) / 100.0)
                .averageToeic(Math.round(averageToeic * 10.0) / 10.0)
                .myGpaPercentile(Math.round(percentile * 100.0) / 100.0)
                .peerProfiles(peerResponses)
                .build();
    }
}
