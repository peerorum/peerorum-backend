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
