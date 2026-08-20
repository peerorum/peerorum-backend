package io.github.peerorum.peer_orum.domain.spec.dto;

import io.github.peerorum.peer_orum.domain.spec.entity.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationResponse {
    private Long id;
    private VerificationStatus status;
}
