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

@Tag(name = "Verification API", description = "Certificate and Activity Verification APIs")
@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;
    private final UserRepository userRepository;

    @Operation(summary = "Verify Certificate (Q-Net)", description = "Verify external certificate using Q-Net Mock API")
    @PostMapping("/certificate")
    public ApiResponse<Long> verifyCertificate(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
                                               @RequestBody CertificateVerificationRequest request) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));
        
        Long certId = verificationService.requestCertificateVerification(
                user.getId(), request.getCertName(), request.getCertNo(), request.getIssueDate());
        
        return ApiResponse.success("Certificate verification requested", certId);
    }

    @Operation(summary = "Verify Activity", description = "Submit activity auth key for verification")
    @PostMapping("/activity")
    public ApiResponse<Long> verifyActivity(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
                                            @RequestBody ActivityVerificationRequest request) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));
        
        Long activityId = verificationService.requestActivityVerification(
                user.getId(), request.getActivityName(), request.getAuthKey());
        
        return ApiResponse.success("Activity verification submitted", activityId);
    }
}
