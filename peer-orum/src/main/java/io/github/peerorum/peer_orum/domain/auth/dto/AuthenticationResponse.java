package io.github.peerorum.peer_orum.domain.auth.dto;

public record AuthenticationResponse(
        String accessToken,
        String uuid,
        String role,
        String name
) {
}
