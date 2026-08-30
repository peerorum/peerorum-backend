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
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowableOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LocalAuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private LocalAuthService localAuthService;

    @Test
    @DisplayName("일반 회원가입 시 비밀번호 원문 대신 BCrypt 해시를 저장한다")
    void signupStoresEncodedPassword() {
        LocalSignupRequest request = new LocalSignupRequest(
                "피어오름",
                " User@Example.com ",
                "password123!"
        );

        when(userRepository.findByEmailIgnoreCase("user@example.com"))
                .thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123!"))
                .thenReturn("encoded-password");
        when(userRepository.existsByVirtualNickname(any()))
                .thenReturn(false);
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtTokenProvider.createToken(any(), any(), any()))
                .thenReturn("access-token");
        when(refreshTokenService.issueRefreshToken(any(User.class)))
                .thenReturn("refresh-token");

        AuthenticationResult result = localAuthService.signup(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();

        assertThat(savedUser.getEmail()).isEqualTo("user@example.com");
        assertThat(savedUser.getPasswordHash()).isEqualTo("encoded-password");
        assertThat(savedUser.getProvider()).isEqualTo(Provider.LOCAL);
        assertThat(savedUser.getRole()).isEqualTo(Role.ROLE_GUEST);
        assertThat(result.accessToken()).isEqualTo("access-token");
        assertThat(result.refreshToken()).isEqualTo("refresh-token");
    }

    @Test
    @DisplayName("Google 가입 이메일로 일반 회원가입하면 로그인 방법을 안내한다")
    void signupRejectsExistingGoogleAccount() {
        User googleUser = user(Provider.GOOGLE, null);
        when(userRepository.findByEmailIgnoreCase("user@example.com"))
                .thenReturn(Optional.of(googleUser));

        CustomException exception = catchThrowableOfType(
                () -> localAuthService.signup(
                        new LocalSignupRequest(
                                "피어오름",
                                "user@example.com",
                                "password123!"
                        )
                ),
                CustomException.class
        );

        assertThat(exception.getErrorCode())
                .isEqualTo(ErrorCode.EMAIL_ALREADY_REGISTERED);
        assertThat(exception.getMessage()).contains("Google");

        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    @DisplayName("카카오 가입 이메일로 일반 로그인하면 카카오 로그인을 안내한다")
    void loginRejectsKakaoAccount() {
        when(userRepository.findByEmailIgnoreCase("user@example.com"))
                .thenReturn(Optional.of(user(Provider.KAKAO, null)));

        CustomException exception = catchThrowableOfType(
                () -> localAuthService.login(
                        new LocalLoginRequest(
                                "user@example.com",
                                "password123!"
                        )
                ),
                CustomException.class
        );

        assertThat(exception.getErrorCode())
                .isEqualTo(ErrorCode.ACCOUNT_PROVIDER_MISMATCH);
        assertThat(exception.getMessage()).contains("카카오");
    }

    @Test
    @DisplayName("일반 계정은 올바른 비밀번호로 로그인할 수 있다")
    void loginSucceedsWithValidPassword() {
        User localUser = user(Provider.LOCAL, "encoded-password");
        when(userRepository.findByEmailIgnoreCase("user@example.com"))
                .thenReturn(Optional.of(localUser));
        when(passwordEncoder.matches("password123!", "encoded-password"))
                .thenReturn(true);
        when(jwtTokenProvider.createToken(any(), any(), any()))
                .thenReturn("access-token");
        when(refreshTokenService.issueRefreshToken(localUser))
                .thenReturn("refresh-token");

        AuthenticationResult result = localAuthService.login(
                new LocalLoginRequest(
                        " USER@example.com ",
                        "password123!"
                )
        );

        assertThat(result.accessToken()).isEqualTo("access-token");
        assertThat(result.role()).isEqualTo("ROLE_USER");
    }

    private User user(Provider provider, String passwordHash) {
        return User.builder()
                .email("user@example.com")
                .name("피어오름")
                .provider(provider)
                .providerId("provider-id")
                .passwordHash(passwordHash)
                .role(Role.ROLE_USER)
                .virtualNickname("User_12345678")
                .build();
    }
}
