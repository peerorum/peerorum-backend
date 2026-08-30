package io.github.peerorum.peer_orum.domain.auth.dto;

public record AuthenticationResult(
        String accessToken,
        String refreshToken,
        String uuid,
        String role,
        String name
) {
}
