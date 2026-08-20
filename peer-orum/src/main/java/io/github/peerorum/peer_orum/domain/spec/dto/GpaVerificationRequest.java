package io.github.peerorum.peer_orum.domain.spec.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GpaVerificationRequest {
    private Double gpa;
    private String scoreType;
    private Double percentile;
    private Double majorAverage;
}
