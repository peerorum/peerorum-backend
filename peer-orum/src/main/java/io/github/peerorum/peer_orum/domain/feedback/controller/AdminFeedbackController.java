package io.github.peerorum.peer_orum.domain.feedback.controller;

import io.github.peerorum.peer_orum.domain.feedback.dto.AdminFeedbackResponse;
import io.github.peerorum.peer_orum.domain.feedback.dto.FeedbackAnswerRequest;
import io.github.peerorum.peer_orum.domain.feedback.dto.FeedbackPublishRequest;
import io.github.peerorum.peer_orum.domain.feedback.entity.FeedbackStatus;
import io.github.peerorum.peer_orum.domain.feedback.service.FeedbackService;
import io.github.peerorum.peer_orum.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin/feedbacks")
@PreAuthorize("hasRole('ADMIN')")
public class AdminFeedbackController {

    private final FeedbackService feedbackService;

    @GetMapping
    public ApiResponse<List<AdminFeedbackResponse>> getAllFeedbacks() {
        return ApiResponse.success(feedbackService.getAllFeedbacksForAdmin());
    }

    @PutMapping("/{id}/status")
    public ApiResponse<Void> updateStatus(@PathVariable Long id, @RequestParam FeedbackStatus status) {
        feedbackService.updateStatus(id, status);
        return ApiResponse.success(null);
    }

    @PutMapping("/{id}/answer")
    public ApiResponse<Void> answerFeedback(@PathVariable Long id, @RequestBody FeedbackAnswerRequest request) {
        feedbackService.answerFeedback(id, request.getAnswer());
        return ApiResponse.success(null);
    }

    @PutMapping("/{id}/publish")
    public ApiResponse<Void> publishFeedback(@PathVariable Long id, @RequestBody FeedbackPublishRequest request) {
        feedbackService.publishFeedback(id, request.getSummary());
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{id}/publish")
    public ApiResponse<Void> unpublishFeedback(@PathVariable Long id) {
        feedbackService.unpublishFeedback(id);
        return ApiResponse.success(null);
    }
}
