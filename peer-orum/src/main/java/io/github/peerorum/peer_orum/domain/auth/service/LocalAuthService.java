package io.github.peerorum.peer_orum.domain.auth.service;

import io.github.peerorum.peer_orum.domain.auth.dto.AuthenticationResult;
import io.github.peerorum.peer_orum.domain.auth.dto.LocalLoginRequest;
import io.github.peerorum.peer_orum.domain.auth.dto.LocalSignupRequest;
import io.github.peerorum.peer_orum.domain.user.entity.Provider;
import io.github.peerorum.peer_orum.domain.user.entity.Role;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import io.github.peerorum.peer_orum.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocalAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public AuthenticationResult signup(LocalSignupRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        userRepository.findByEmailIgnoreCase(normalizedEmail)
                .ifPresent(user -> {
                    throw new CustomException(
                            ErrorCode.EMAIL_ALREADY_REGISTERED,
                            duplicateSignupMessage(user.getProvider())
                    );
                });

        User user = User.builder()
                .email(normalizedEmail)
                .name(request.name().trim())
                .provider(Provider.LOCAL)
                .providerId("local-" + UUID.randomUUID())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.ROLE_GUEST)
                .virtualNickname(generateVirtualNickname())
                .build();

        User savedUser = userRepository.save(user);

        return issueAuthentication(savedUser);
    }

    @Transactional
    public AuthenticationResult login(LocalLoginRequest request) {
        User user = userRepository
                .findByEmailIgnoreCase(normalizeEmail(request.email()))
                .orElseThrow(
                        () -> new CustomException(
                                ErrorCode.INVALID_CREDENTIALS
                        )
                );

        if (user.getProvider() != Provider.LOCAL) {
            throw new CustomException(
                    ErrorCode.ACCOUNT_PROVIDER_MISMATCH,
                    providerLoginMessage(user.getProvider())
            );
        }

        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(
                        request.password(),
                        user.getPasswordHash()
                )) {
            throw new CustomException(
                    ErrorCode.INVALID_CREDENTIALS
            );
        }

        return issueAuthentication(user);
    }

    @Transactional(readOnly = true)
    public void verifyPassword(String email, String rawPassword) {
        User user = userRepository
                .findByEmailIgnoreCase(normalizeEmail(email))
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));

        if (user.getProvider() != Provider.LOCAL) {
            // For social login, we bypass password check as we don't store their password.
            return;
        }

        if (user.getPasswordHash() == null || !passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new CustomException(ErrorCode.INVALID_CREDENTIALS, "비밀번호가 일치하지 않습니다.");
        }
    }

    private AuthenticationResult issueAuthentication(User user) {
        String accessToken =
                jwtTokenProvider.createToken(
                        user.getEmail(),
                        user.getRole().name(),
                        user.getAnonymousUuid()
                );

        String refreshToken =
                refreshTokenService.issueRefreshToken(user);

        return new AuthenticationResult(
                accessToken,
                refreshToken,
                user.getAnonymousUuid(),
                user.getRole().name(),
                user.getName()
        );
    }

    private String generateVirtualNickname() {
        String nickname;

        do {
            nickname =
                    "User_"
                            + UUID.randomUUID()
                            .toString()
                            .substring(0, 8);
        } while (userRepository.existsByVirtualNickname(nickname));

        return nickname;
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String duplicateSignupMessage(Provider provider) {
        return switch (provider) {
            case LOCAL ->
                    "이미 일반 회원가입으로 가입된 이메일입니다. 로그인해주세요.";
            case KAKAO ->
                    "이미 카카오로 가입된 이메일입니다. 카카오로 로그인해주세요.";
            case GOOGLE ->
                    "이미 Google로 가입된 이메일입니다. Google로 로그인해주세요.";
        };
    }

    private String providerLoginMessage(Provider provider) {
        return switch (provider) {
            case LOCAL ->
                    "일반 로그인 계정입니다.";
            case KAKAO ->
                    "카카오로 가입된 이메일입니다. 카카오로 로그인해주세요.";
            case GOOGLE ->
                    "Google로 가입된 이메일입니다. Google로 로그인해주세요.";
        };
    }
}
