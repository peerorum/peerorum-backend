package io.github.peerorum.peer_orum.domain.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AiVerificationResult {
    private boolean verified;
    private String reason;
}
