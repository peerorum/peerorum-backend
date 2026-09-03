package io.github.peerorum.peer_orum.global.security.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
public class OAuth2FailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Value("${FRONTEND_URL:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        String errorCode = "oauth2_failed";
        if (exception instanceof OAuth2AuthenticationException oauthException) {
            String candidateCode = oauthException.getError().getErrorCode();
            if (candidateCode != null
                    && (candidateCode.startsWith("account_exists_with_")
                    || candidateCode.equals("oauth_email_required"))) {
                errorCode = candidateCode;
            }
        }

        log.error(
                "OAuth2 Login Failed. type={}, code={}, message={}",
                exception.getClass().getSimpleName(),
                errorCode,
                exception.getMessage()
        );

        String redirectUrl = frontendUrl
                + "/login?error="
                + URLEncoder.encode(errorCode, StandardCharsets.UTF_8);
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
