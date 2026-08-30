package io.github.peerorum.peer_orum.domain.auth.controller;

import io.github.peerorum.peer_orum.domain.auth.dto.AuthenticationResponse;
import io.github.peerorum.peer_orum.domain.auth.dto.AuthenticationResult;
import io.github.peerorum.peer_orum.domain.auth.dto.LocalLoginRequest;
import io.github.peerorum.peer_orum.domain.auth.dto.LocalSignupRequest;
import io.github.peerorum.peer_orum.domain.auth.dto.TokenReissueResult;
import io.github.peerorum.peer_orum.domain.auth.service.LocalAuthService;
import io.github.peerorum.peer_orum.global.security.jwt.JwtTokenProvider;
import io.github.peerorum.peer_orum.global.security.jwt.RefreshTokenCookieManager;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CookieValue;
import io.github.peerorum.peer_orum.domain.auth.dto.EmailVerificationRequest;
import io.github.peerorum.peer_orum.domain.auth.dto.TokenReissueResponse;
import io.github.peerorum.peer_orum.domain.auth.dto.TokenVerificationRequest;
import io.github.peerorum.peer_orum.domain.auth.service.EmailVerificationService;
import io.github.peerorum.peer_orum.domain.auth.service.RefreshTokenService;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.common.ApiResponse;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "Auth API",
        description = "Authentication and Email Verification APIs"
)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final EmailVerificationService emailVerificationService;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final RefreshTokenCookieManager refreshTokenCookieManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final LocalAuthService localAuthService;

    @Operation(
            summary = "Sign Up with Email",
            description = "Create a local account and issue access and refresh tokens"
    )
    @PostMapping("/signup")
    public ApiResponse<AuthenticationResponse> signup(
            @Valid @RequestBody LocalSignupRequest request,
            HttpServletResponse servletResponse
    ) {
        AuthenticationResult result = localAuthService.signup(request);
        return authenticationResponse(
                "Signed up successfully",
                result,
                servletResponse
        );
    }

    @Operation(
            summary = "Log In with Email",
            description = "Authenticate a local account and issue access and refresh tokens"
    )
    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> login(
            @Valid @RequestBody LocalLoginRequest request,
            HttpServletResponse servletResponse
    ) {
        AuthenticationResult result = localAuthService.login(request);
        return authenticationResponse(
                "Logged in successfully",
                result,
                servletResponse
        );
    }

    @Operation(
            summary = "Send School Email Verification",
            description = "Send verification token to university email"
    )
    @PostMapping("/email/send")
    public ApiResponse<Void> sendEmail(
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal,
            @RequestBody EmailVerificationRequest request
    ) {
        User user = userRepository
                .findByEmail(principal.getUsername())
                .orElseThrow(
                        () -> new CustomException(
                                ErrorCode.UNAUTHORIZED
                        )
                );

        emailVerificationService.sendVerificationEmail(
                user.getId(),
                request.getEmail()
        );

        return ApiResponse.success(
                "Email sent successfully",
                null
        );
    }

    @Operation(
            summary = "Verify School Email",
            description = "Verify university email with token"
    )
    @PostMapping("/email/verify")
    public ApiResponse<Void> verifyEmail(
            @AuthenticationPrincipal
            org.springframework.security.core.userdetails.User principal,
            @RequestBody TokenVerificationRequest request
    ) {
        User user = userRepository
                .findByEmail(principal.getUsername())
                .orElseThrow(
                        () -> new CustomException(
                                ErrorCode.UNAUTHORIZED
                        )
                );

        emailVerificationService.verifyEmail(
                user.getId(),
                request.getToken()
        );

        return ApiResponse.success(
                "Email verified successfully",
                null
        );
    }

    @Operation(
            summary = "Reissue JWT Tokens",
            description = "Reissue access and refresh tokens using a valid refresh token"
    )
    @PostMapping("/refresh")
    public ApiResponse<TokenReissueResponse> refresh(
            @CookieValue(
                    name = RefreshTokenCookieManager.COOKIE_NAME,
                    required = false
            )
            String refreshToken,
            HttpServletResponse servletResponse
    ) {
        TokenReissueResult result =
                refreshTokenService.reissueTokens(
                        refreshToken
                );

        refreshTokenCookieManager.addRefreshTokenCookie(
                servletResponse,
                result.refreshToken(),
                jwtTokenProvider.getExpirationFromToken(
                        result.refreshToken()
                )
        );

        TokenReissueResponse responseBody =
                new TokenReissueResponse(
                        result.accessToken(),
                        result.uuid(),
                        result.role(),
                        result.name()
                );

        return ApiResponse.success(
                "Tokens reissued successfully",
                responseBody
        );
    }

    @Operation(
            summary = "Logout",
            description = "Delete the stored refresh token"
    )
    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @CookieValue(
                    name = RefreshTokenCookieManager.COOKIE_NAME,
                    required = false
            )
            String refreshToken,
            HttpServletResponse servletResponse
    ) {
        try {
            refreshTokenService.logout(refreshToken);
        } finally {
            refreshTokenCookieManager.deleteRefreshTokenCookie(
                    servletResponse
            );
        }

        return ApiResponse.success(
                "Logged out successfully",
                null
        );
    }

    private ApiResponse<AuthenticationResponse> authenticationResponse(
            String message,
            AuthenticationResult result,
            HttpServletResponse servletResponse
    ) {
        refreshTokenCookieManager.addRefreshTokenCookie(
                servletResponse,
                result.refreshToken(),
                jwtTokenProvider.getExpirationFromToken(
                        result.refreshToken()
                )
        );

        AuthenticationResponse responseBody =
                new AuthenticationResponse(
                        result.accessToken(),
                        result.uuid(),
                        result.role(),
                        result.name()
                );

        return ApiResponse.success(message, responseBody);
    }
}
