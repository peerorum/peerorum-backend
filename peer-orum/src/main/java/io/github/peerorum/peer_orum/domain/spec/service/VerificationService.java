package io.github.peerorum.peer_orum.domain.spec.service;

import io.github.peerorum.peer_orum.domain.spec.entity.Activity;
import io.github.peerorum.peer_orum.domain.spec.entity.Award;
import io.github.peerorum.peer_orum.domain.spec.entity.Certificate;
import io.github.peerorum.peer_orum.domain.spec.entity.Intern;
import io.github.peerorum.peer_orum.domain.spec.entity.VerificationStatus;
import io.github.peerorum.peer_orum.domain.spec.repository.ActivityRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.AwardRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.CertificateRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.InternRepository;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import io.github.peerorum.peer_orum.domain.ai.service.AiService;
import io.github.peerorum.peer_orum.domain.ai.dto.AiVerificationResult;
import io.github.peerorum.peer_orum.domain.spec.dto.VerificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

import io.github.peerorum.peer_orum.domain.spec.repository.SpecProfileRepository;

@Slf4j
@RequiredArgsConstructor
@Service
public class VerificationService {

    private final CertificateRepository certificateRepository;
    private final ActivityRepository activityRepository;
    private final InternRepository internRepository;
    private final AwardRepository awardRepository;
    private final UserRepository userRepository;
    private final AiService aiService;
    private final SpecProfileRepository specProfileRepository;

    @Transactional
    public VerificationResponse requestCertificateVerification(Long userId, String certName, String certNo, LocalDate issueDate, String fileUrl, MultipartFile file) {
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
        String reason = null;

        if (file != null && !file.isEmpty()) {
            try {
                String expectedDetails = "자격증명: " + certName + ", 발급번호/점수: " + certNo;
                AiVerificationResult result = aiService.verifyDocument(user.getName(), "자격증", expectedDetails, file.getBytes(), file.getContentType());
                isValid = result.isVerified();
                reason = result.getReason();
            } catch (Exception e) {
                log.error("Failed to read file bytes for AI verification", e);
            }
        }
        
        if (isValid) {
            certificate.updateStatus(VerificationStatus.VERIFIED);
        } else {
            certificate.updateStatus(VerificationStatus.REJECTED);
        }

        Certificate saved = certificateRepository.save(certificate);
        return VerificationResponse.builder().id(saved.getId()).status(saved.getStatus()).reason(reason).build();
    }

    @Transactional
    public VerificationResponse requestActivityVerification(Long userId, String activityName, String period, String detail, String authKey, String fileUrl, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        Activity activity = Activity.builder()
                .user(user)
                .activityName(activityName)
                .period(period)
                .detail(detail)
                .authKey(authKey != null ? authKey : "")
                .fileUrl(fileUrl)
                .status(VerificationStatus.PENDING)
                .build();

        boolean isValid = false;
        String reason = null;
        if (file != null && !file.isEmpty()) {
            try {
                String expectedDetails = "활동명: " + activityName + ", 인증키/내용: " + authKey;
                AiVerificationResult result = aiService.verifyDocument(user.getName(), "대외활동", expectedDetails, file.getBytes(), file.getContentType());
                isValid = result.isVerified();
                reason = result.getReason();
            } catch (Exception e) {
                log.error("Failed to read file bytes for AI verification", e);
            }
            if (isValid) {
                activity.updateStatus(VerificationStatus.VERIFIED);
            } else {
                activity.updateStatus(VerificationStatus.REJECTED);
            }
        } else {
            // No file uploaded, self reported
            activity.updateStatus(VerificationStatus.NONE);
        }

        Activity saved = activityRepository.save(activity);
        return VerificationResponse.builder().id(saved.getId()).status(saved.getStatus()).reason(reason).build();
    }

    @Transactional
    public VerificationResponse requestInternVerification(Long userId, String company, String period, String detail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        Intern intern = Intern.builder()
                .user(user)
                .company(company)
                .period(period)
                .detail(detail)
                .build();

        Intern saved = internRepository.save(intern);
        return VerificationResponse.builder().id(saved.getId()).status(VerificationStatus.NONE).build();
    }

    @Transactional
    public VerificationResponse requestAwardVerification(Long userId, String name, String host, String awardDate, String detail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        Award award = Award.builder()
                .user(user)
                .name(name)
                .host(host)
                .awardDate(awardDate)
                .detail(detail)
                .build();

        Award saved = awardRepository.save(award);
        return VerificationResponse.builder().id(saved.getId()).status(VerificationStatus.NONE).build();
    }

    public VerificationResponse requestGpaVerification(Long userId, Double gpa, String scoreType, Double percentile, Double majorAverage, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        boolean isValid = false;
        String reason = null;
        if (file != null && !file.isEmpty()) {
            try {
                StringBuilder detailsBuilder = new StringBuilder();
                detailsBuilder.append("평균평점: ").append(gpa);
                if (percentile != null) {
                    detailsBuilder.append(", 환산점수: ").append(percentile);
                }
                if (majorAverage != null) {
                    detailsBuilder.append(", 전공평균평점: ").append(majorAverage);
                }
                String expectedDetails = detailsBuilder.toString();
                AiVerificationResult result = aiService.verifyDocument(user.getName(), "대학교 학점 증명(DK UP 포맷)", expectedDetails, file.getBytes(), file.getContentType());
                isValid = result.isVerified();
                reason = result.getReason();
            } catch (Exception e) {
                log.error("Failed to read file bytes for GPA verification", e);
            }
        }

        if (isValid) {
            specProfileRepository.findByUser(user).ifPresent(specProfile -> {
                specProfile.updateGpa(gpa, percentile, majorAverage);
                specProfileRepository.save(specProfile);
            });
        }

        return VerificationResponse.builder().status(isValid ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED).reason(reason).build();
    }

    public VerificationResponse requestLanguageVerification(Long userId, String testName, String score, String date, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        boolean isValid = false;
        String reason = null;
        if (file != null && !file.isEmpty()) {
            try {
                String expectedDetails = "시험명: " + testName + ", 점수/등급: " + score + ", 취득일: " + (date != null ? date : "N/A");
                AiVerificationResult result = aiService.verifyDocument(user.getName(), "어학 성적표", expectedDetails, file.getBytes(), file.getContentType());
                isValid = result.isVerified();
                reason = result.getReason();
            } catch (Exception e) {
                log.error("Failed to read file bytes for Language verification", e);
            }
        }

        if (isValid) {
            specProfileRepository.findByUser(user).ifPresent(specProfile -> {
                if (testName.toUpperCase().contains("TOEIC") && !testName.toUpperCase().contains("SPEAKING")) {
                    try { specProfile.updateLanguageScore(Integer.parseInt(score), null, null); } catch (NumberFormatException ignored) {}
                } else if (testName.toUpperCase().contains("OPIC")) {
                    specProfile.updateLanguageScore(null, score, null);
                } else if (testName.toUpperCase().contains("TOEIC SPEAKING")) {
                    specProfile.updateLanguageScore(null, null, score);
                }
                specProfileRepository.save(specProfile);
            });
        }

        return VerificationResponse.builder().status(isValid ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED).reason(reason).build();
    }
}
