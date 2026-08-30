package io.github.peerorum.peer_orum.domain.auth.dto;

public record TokenReissueResponse(
        String accessToken,
        String uuid,
        String role,
        String name
) {
}
