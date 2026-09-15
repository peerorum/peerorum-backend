package io.github.peerorum.peer_orum.domain.feedback.controller;

import io.github.peerorum.peer_orum.domain.feedback.dto.FeedbackCreateRequest;
import io.github.peerorum.peer_orum.domain.feedback.dto.MyFeedbackResponse;
import io.github.peerorum.peer_orum.domain.feedback.dto.PublishedFeedbackResponse;
import io.github.peerorum.peer_orum.domain.feedback.service.FeedbackService;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.common.ApiResponse;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final UserRepository userRepository;

    @PostMapping
    public ApiResponse<Void> createFeedback(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
                                             @RequestBody FeedbackCreateRequest request) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));

        feedbackService.createFeedback(user.getId(), request);
        return ApiResponse.success(null);
    }

    @GetMapping
    public ApiResponse<List<PublishedFeedbackResponse>> getPublishedFeedbacks() {
        return ApiResponse.success(feedbackService.getPublishedFeedbacks());
    }

    @GetMapping("/my")
    public ApiResponse<List<MyFeedbackResponse>> getMyFeedbacks(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));

        return ApiResponse.success(feedbackService.getMyFeedbacks(user.getId()));
    }
}
