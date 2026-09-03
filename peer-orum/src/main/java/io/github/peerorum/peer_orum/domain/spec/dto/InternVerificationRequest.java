package io.github.peerorum.peer_orum.domain.spec.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class InternVerificationRequest {
    private String company;
    private String period;
    private String detail;
}
