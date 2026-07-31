package io.github.peerorum.peer_orum.domain.auth.controller;

import io.github.peerorum.peer_orum.domain.auth.dto.EmailVerificationRequest;
import io.github.peerorum.peer_orum.domain.auth.dto.RefreshTokenRequest;
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
            @RequestBody RefreshTokenRequest request
    ) {
        TokenReissueResponse response =
                refreshTokenService.reissueTokens(
                        request.refreshToken()
                );

        return ApiResponse.success(
                "Tokens reissued successfully",
                response
        );
    }

    @Operation(
            summary = "Logout",
            description = "Delete the stored refresh token"
    )
    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @RequestBody RefreshTokenRequest request
    ) {
        refreshTokenService.logout(
                request.refreshToken()
        );

        return ApiResponse.success(
                "Logged out successfully",
                null
        );
    }
}