package io.github.peerorum.peer_orum.domain.comparison.dto;

import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SpecProfileResponse {
    private String anonymousUuid;
    private String virtualNickname;
    private Double gpa;
    private Integer toeicScore;
    private String desiredJob;

    public static SpecProfileResponse from(SpecProfile specProfile) {
        return SpecProfileResponse.builder()
                .anonymousUuid(specProfile.getUser().getAnonymousUuid())
                .virtualNickname(specProfile.getUser().getVirtualNickname())
                .gpa(specProfile.getGpa())
                .toeicScore(specProfile.getToeicScore())
                .desiredJob(specProfile.getDesiredJob())
                .build();
    }
}
