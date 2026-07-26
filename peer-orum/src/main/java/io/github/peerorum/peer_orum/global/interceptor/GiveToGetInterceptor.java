package io.github.peerorum.peer_orum.global.interceptor;

import io.github.peerorum.peer_orum.domain.auth.entity.SchoolAuth;
import io.github.peerorum.peer_orum.domain.auth.repository.SchoolAuthRepository;
import io.github.peerorum.peer_orum.domain.spec.entity.VerificationStatus;
import io.github.peerorum.peer_orum.domain.spec.repository.ActivityRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.CertificateRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.SpecProfileRepository;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@RequiredArgsConstructor
@Component
public class GiveToGetInterceptor implements HandlerInterceptor {

    private final UserRepository userRepository;
    private final SpecProfileRepository specProfileRepository;
    private final SchoolAuthRepository schoolAuthRepository;
    private final CertificateRepository certificateRepository;
    private final ActivityRepository activityRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));

        // 1. 프로필 작성 여부 검사
        if (specProfileRepository.findByUser(user).isEmpty()) {
            throw new CustomException(ErrorCode.HANDLE_ACCESS_DENIED, "Please create a spec profile first.");
        }

        // 2. 최소 1개 인증 여부 검사 (Give to Get Rule)
        boolean hasVerifiedSchool = schoolAuthRepository.findByUser(user)
                .map(SchoolAuth::isVerified)
                .orElse(false);
                
        boolean hasVerifiedCertificate = certificateRepository.existsByUserAndStatus(user, VerificationStatus.VERIFIED);
        boolean hasVerifiedActivity = activityRepository.existsByUserAndStatus(user, VerificationStatus.VERIFIED);

        if (!hasVerifiedSchool && !hasVerifiedCertificate && !hasVerifiedActivity) {
            throw new CustomException(ErrorCode.HANDLE_ACCESS_DENIED, "Give-to-Get: You must verify at least one spec (e.g., University Email, Certificate) to view others.");
        }

        return true;
    }
}
