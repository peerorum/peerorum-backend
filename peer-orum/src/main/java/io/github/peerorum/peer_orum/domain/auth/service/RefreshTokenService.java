package io.github.peerorum.peer_orum.domain.auth.service;

import io.github.peerorum.peer_orum.domain.auth.dto.TokenReissueResult;
import io.github.peerorum.peer_orum.domain.auth.entity.RefreshToken;
import io.github.peerorum.peer_orum.domain.auth.repository.RefreshTokenRepository;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
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
    public TokenReissueResult reissueTokens(
            String requestedRefreshToken
    ) {
        if (requestedRefreshToken == null
                || requestedRefreshToken.isBlank()) {
            throw new CustomException(ErrorCode.INVALID_TOKEN);
        }

        RefreshToken storedRefreshToken =
                refreshTokenRepository
                        .findByToken(requestedRefreshToken)
                        .orElseThrow(
                                () -> new CustomException(
                                        ErrorCode.INVALID_TOKEN
                                )
                        );

        if (storedRefreshToken
                .getExpiresAt()
                .isBefore(Instant.now())) {

            refreshTokenRepository.delete(storedRefreshToken);

            throw new CustomException(
                    ErrorCode.EXPIRED_TOKEN
            );
        }

        if (!jwtTokenProvider.validateRefreshToken(
                requestedRefreshToken
        )) {
            throw new CustomException(
                    ErrorCode.INVALID_TOKEN
            );
        }

        User user = storedRefreshToken.getUser();

        String tokenEmail =
                jwtTokenProvider.getEmailFromToken(
                        requestedRefreshToken
                );

        if (!user.getEmail().equals(tokenEmail)) {
            throw new CustomException(
                    ErrorCode.INVALID_TOKEN
            );
        }

        String newAccessToken =
                jwtTokenProvider.createToken(
                        user.getEmail(),
                        user.getRole().name(),
                        user.getAnonymousUuid()
                );

        String newRefreshToken =
                issueRefreshToken(user);

        return new TokenReissueResult(
                newAccessToken,
                newRefreshToken,
                user.getAnonymousUuid(),
                user.getRole().name(),
                user.getName()
        );
    }

    @Transactional
    public void logout(String requestedRefreshToken) {
        if (requestedRefreshToken == null
                || requestedRefreshToken.isBlank()) {
            throw new CustomException(
                    ErrorCode.INVALID_TOKEN
            );
        }

        RefreshToken storedRefreshToken =
                refreshTokenRepository
                        .findByToken(requestedRefreshToken)
                        .orElseThrow(
                                () -> new CustomException(
                                        ErrorCode.INVALID_TOKEN
                                )
                        );

        refreshTokenRepository.delete(storedRefreshToken);
    }
}
