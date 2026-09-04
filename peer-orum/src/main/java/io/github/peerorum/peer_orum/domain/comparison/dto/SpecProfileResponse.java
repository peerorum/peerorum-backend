package io.github.peerorum.peer_orum.domain.comparison.dto;

import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SpecProfileResponse {
    private String anonymousUuid;
    private String virtualNickname;
    private String major;
    private Double gpa;
    private Integer toeicScore;
    private String desiredJob;
    private Integer verificationCount;
    private Integer internCount;
    private Integer activityCount;

    public static SpecProfileResponse of(SpecProfile specProfile, int certCount, int internCount, int activityCount) {
        
        
        

        return SpecProfileResponse.builder()
                .anonymousUuid(specProfile.getUser().getAnonymousUuid())
                .virtualNickname(specProfile.getUser().getVirtualNickname())
                .major(specProfile.getMajor())
                .gpa(specProfile.getGpa())
                .toeicScore(specProfile.getToeicScore())
                .desiredJob(specProfile.getDesiredJob())
                .verificationCount(certCount)
                .internCount(internCount)
                .activityCount(activityCount)
                .build();
    }
}
