package io.github.peerorum.peer_orum.global.security.oauth2;

import io.github.peerorum.peer_orum.domain.auth.service.RefreshTokenService;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.global.security.jwt.JwtTokenProvider;
import io.github.peerorum.peer_orum.global.security.jwt.RefreshTokenCookieManager;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenCookieManager refreshTokenCookieManager;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        CustomOAuth2User oAuth2User =
                (CustomOAuth2User) authentication.getPrincipal();

        User user = oAuth2User.getUser();

        String accessToken =
                jwtTokenProvider.createToken(
                        user.getEmail(),
                        user.getRole().name(),
                        user.getAnonymousUuid()
                );

        String refreshToken =
                refreshTokenService.issueRefreshToken(user);

        refreshTokenCookieManager.addRefreshTokenCookie(
                response,
                refreshToken,
                jwtTokenProvider.getExpirationFromToken(
                        refreshToken
                )
        );

        clearAuthenticationAttributes(request);

        log.info(
                "OAuth2 Login Success. userId={}",
                user.getId()
        );

        String redirectUrl = UriComponentsBuilder
                .fromUriString(
                        frontendUrl + "/oauth2/redirect"
                )
                .queryParam("token", accessToken)
                .queryParam(
                        "uuid",
                        user.getAnonymousUuid()
                )
                .queryParam(
                        "role",
                        user.getRole().name()
                )
                .queryParam(
                        "name",
                        user.getName()
                )
                .build()
                .encode()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }
}