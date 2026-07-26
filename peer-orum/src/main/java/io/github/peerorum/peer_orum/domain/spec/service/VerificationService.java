package io.github.peerorum.peer_orum.domain.spec.service;

import io.github.peerorum.peer_orum.domain.spec.entity.Activity;
import io.github.peerorum.peer_orum.domain.spec.entity.Certificate;
import io.github.peerorum.peer_orum.domain.spec.entity.VerificationStatus;
import io.github.peerorum.peer_orum.domain.spec.repository.ActivityRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.CertificateRepository;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@RequiredArgsConstructor
@Service
public class VerificationService {

    private final CertificateRepository certificateRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final QNetMockClient qNetMockClient;

    @Transactional
    public Long requestCertificateVerification(Long userId, String certName, String certNo, LocalDate issueDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        Certificate certificate = Certificate.builder()
                .user(user)
                .certName(certName)
                .certNo(certNo)
                .issueDate(issueDate)
                .build();

        boolean isValid = qNetMockClient.verifyCertificate(certName, certNo, user.getName());
        
        if (isValid) {
            certificate.updateStatus(VerificationStatus.VERIFIED);
        } else {
            certificate.updateStatus(VerificationStatus.REJECTED);
        }

        return certificateRepository.save(certificate).getId();
    }

    @Transactional
    public Long requestActivityVerification(Long userId, String activityName, String authKey) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        Activity activity = Activity.builder()
                .user(user)
                .activityName(activityName)
                .authKey(authKey)
                .build();

        // 대외활동 검증은 관리자 수동 검증 또는 외부 API에 의존하므로 기본적으로 PENDING 상태로 둠
        // 차후 관리자 승인 API에서 VERIFIED 처리
        activity.updateStatus(VerificationStatus.PENDING);

        return activityRepository.save(activity).getId();
    }
}
