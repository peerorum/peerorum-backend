package io.github.peerorum.peer_orum.domain.auth.service;

import io.github.peerorum.peer_orum.domain.auth.entity.RefreshToken;
import io.github.peerorum.peer_orum.domain.auth.repository.RefreshTokenRepository;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public String issueRefreshToken(User user) {
        String token =
                jwtTokenProvider.createRefreshToken(user.getEmail());

        Instant expiresAt =
                jwtTokenProvider.getExpirationFromToken(token);

        refreshTokenRepository.findByUser(user)
                .ifPresentOrElse(
                        existingToken ->
                                existingToken.updateToken(
                                        token,
                                        expiresAt
                                ),
                        () -> refreshTokenRepository.save(
                                RefreshToken.builder()
                                        .user(user)
                                        .token(token)
                                        .expiresAt(expiresAt)
                                        .build()
                        )
                );

        return token;
    }

    @Transactional
    public void deleteRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}