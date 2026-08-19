package io.github.peerorum.peer_orum.global.security.oauth2;

import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.global.security.jwt.JwtTokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        User user = oAuth2User.getUser();

        String token = jwtTokenProvider.createToken(user.getEmail(), user.getRole().name(), user.getAnonymousUuid());

        log.info("OAuth2 Login Success. Token generated.");

        // Redirect to frontend OAuth2 callback page
        String redirectUrl = String.format("http://localhost:5173/oauth2/redirect?token=%s&uuid=%s&role=%s",
            token, user.getAnonymousUuid(), user.getRole().name());
        response.sendRedirect(redirectUrl);
    }
}
