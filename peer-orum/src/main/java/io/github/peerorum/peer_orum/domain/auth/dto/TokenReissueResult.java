package io.github.peerorum.peer_orum.domain.auth.dto;

public record TokenReissueResult(
        String accessToken,
        String refreshToken,
        String uuid
) {
}