package io.github.peerorum.peer_orum.domain.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EmailVerificationRequest {
    private String email;
}
