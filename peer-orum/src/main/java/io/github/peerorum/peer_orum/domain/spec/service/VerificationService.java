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
import io.github.peerorum.peer_orum.domain.ai.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Slf4j
@RequiredArgsConstructor
@Service
public class VerificationService {

    private final CertificateRepository certificateRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final AiService aiService;

    @Transactional
    public Long requestCertificateVerification(Long userId, String certName, String certNo, LocalDate issueDate, String fileUrl, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        Certificate certificate = Certificate.builder()
                .user(user)
                .certName(certName)
                .certNo(certNo)
                .issueDate(issueDate)
                .fileUrl(fileUrl)
                .build();

        boolean isValid = false;

        if (file != null && !file.isEmpty()) {
            try {
                String expectedDetails = "자격증명: " + certName + ", 발급번호/점수: " + certNo;
                isValid = aiService.verifyDocument(user.getName(), "자격증", expectedDetails, file.getBytes(), file.getContentType());
            } catch (Exception e) {
                log.error("Failed to read file bytes for AI verification", e);
            }
        } else {
            log.warn("File is empty or null, cannot verify via AI");
        }
        
        if (isValid) {
            certificate.updateStatus(VerificationStatus.VERIFIED);
        } else {
            certificate.updateStatus(VerificationStatus.REJECTED);
        }

        return certificateRepository.save(certificate).getId();
    }

    @Transactional
    public Long requestActivityVerification(Long userId, String activityName, String authKey, String fileUrl, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        Activity activity = Activity.builder()
                .user(user)
                .activityName(activityName)
                .authKey(authKey)
                .fileUrl(fileUrl)
                .build();

        boolean isValid = false;

        if (file != null && !file.isEmpty()) {
            try {
                String expectedDetails = "활동명: " + activityName + ", 인증키/내용: " + authKey;
                isValid = aiService.verifyDocument(user.getName(), "대외활동", expectedDetails, file.getBytes(), file.getContentType());
            } catch (Exception e) {
                log.error("Failed to read file bytes for AI verification", e);
            }
        } else {
            log.warn("File is empty or null, cannot verify activity via AI");
        }

        if (isValid) {
            activity.updateStatus(VerificationStatus.VERIFIED);
        } else {
            activity.updateStatus(VerificationStatus.REJECTED);
        }

        return activityRepository.save(activity).getId();
    }
}
