package io.github.peerorum.peer_orum.domain.comparison.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class ComparisonStatisticsResponse {
    private long totalPeers;
    private double averageGpa;
    private double averageToeic;
    private double myGpaPercentile; // 백분위 (0 ~ 100, 높을수록 상위)
    
    private List<SpecProfileResponse> peerProfiles;
}
