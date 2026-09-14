package io.github.peerorum.peer_orum.domain.feedback.controller;

import io.github.peerorum.peer_orum.domain.feedback.dto.FeedbackCreateRequest;
import io.github.peerorum.peer_orum.domain.feedback.dto.FeedbackResponse;
import io.github.peerorum.peer_orum.domain.feedback.entity.FeedbackStatus;
import io.github.peerorum.peer_orum.domain.feedback.service.FeedbackService;
import io.github.peerorum.peer_orum.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ApiResponse<Void> createFeedback(@RequestBody FeedbackCreateRequest request) {
        feedbackService.createFeedback(request);
        return ApiResponse.success(null);
    }

    @GetMapping
    public ApiResponse<List<FeedbackResponse>> getAllFeedbacks() {
        List<FeedbackResponse> responses = feedbackService.getAllFeedbacks();
        return ApiResponse.success(responses);
    }

    @PostMapping("/{id}/upvote")
    public ApiResponse<Void> upvoteFeedback(@PathVariable Long id) {
        feedbackService.upvoteFeedback(id);
        return ApiResponse.success(null);
    }
    
    @PutMapping("/{id}/status")
    public ApiResponse<Void> updateStatus(@PathVariable Long id, @RequestParam FeedbackStatus status) {
        feedbackService.updateStatus(id, status);
        return ApiResponse.success(null);
    }
}
