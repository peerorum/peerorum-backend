package io.github.peerorum.peer_orum.domain.spec.controller;

import io.github.peerorum.peer_orum.domain.spec.dto.ActivityVerificationRequest;
import io.github.peerorum.peer_orum.domain.spec.dto.CertificateVerificationRequest;
import io.github.peerorum.peer_orum.domain.spec.service.VerificationService;
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

import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import io.github.peerorum.peer_orum.global.util.S3UploadService;
import org.springframework.http.MediaType;

@Tag(name = "Verification API", description = "Certificate and Activity Verification APIs")
@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;
    private final UserRepository userRepository;
    private final S3UploadService s3UploadService;

    @Operation(summary = "Verify Certificate (Q-Net)", description = "Verify external certificate using Q-Net Mock API and upload proof")
    @PostMapping(value = "/certificate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Long> verifyCertificate(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
                                               @RequestPart("request") CertificateVerificationRequest request,
                                               @RequestPart(value = "file", required = false) MultipartFile file) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));
        
        String fileUrl = s3UploadService.uploadFile(file, "certificates");

        Long certId = verificationService.requestCertificateVerification(
                user.getId(), request.getCertName(), request.getCertNo(), request.getIssueDate(), fileUrl, file);
        
        return ApiResponse.success("Certificate verification requested", certId);
    }

    @Operation(summary = "Verify Activity", description = "Submit activity auth key and proof file for verification")
    @PostMapping(value = "/activity", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Long> verifyActivity(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
                                            @RequestPart("request") ActivityVerificationRequest request,
                                            @RequestPart(value = "file", required = false) MultipartFile file) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));
        
        String fileUrl = s3UploadService.uploadFile(file, "activities");

        Long activityId = verificationService.requestActivityVerification(
                user.getId(), request.getActivityName(), request.getAuthKey(), fileUrl, file);
        
        return ApiResponse.success("Activity verification submitted", activityId);
    }
}
