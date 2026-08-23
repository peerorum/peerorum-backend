package io.github.peerorum.peer_orum.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalUsers;
    private long newSignups;
    private long totalSpecCards;
    private long reportCount;
    
    private List<RecentSignupDto> recentSignups;
    private List<SignupTrendDto> signupTrend;
    private List<GenderDistributionDto> genderDistribution;
    private List<RecentReportDto> recentReports;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SignupTrendDto {
        private String date;
        private int count;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GenderDistributionDto {
        private String name;
        private int value;
        private String color;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentReportDto {
        private String id;
        private String type;
        private String reason;
        private String date;
        private String status;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentSignupDto {
        private String name;
        private String handle;
        private String time;
    }
}
