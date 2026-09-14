package io.github.peerorum.peer_orum.domain.feedback.service;

import io.github.peerorum.peer_orum.domain.feedback.dto.FeedbackCreateRequest;
import io.github.peerorum.peer_orum.domain.feedback.dto.FeedbackResponse;
import io.github.peerorum.peer_orum.domain.feedback.entity.Feedback;
import io.github.peerorum.peer_orum.domain.feedback.entity.FeedbackStatus;
import io.github.peerorum.peer_orum.domain.feedback.repository.FeedbackRepository;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    @Transactional
    public void createFeedback(FeedbackCreateRequest request) {
        Feedback feedback = Feedback.builder()
                .content(request.getContent())
                .contact(request.getContact())
                .build();
        feedbackRepository.save(feedback);
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> getAllFeedbacks() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(FeedbackResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void upvoteFeedback(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "Feedback not found"));
        feedback.incrementUpvotes();
    }
    
    @Transactional
    public void updateStatus(Long id, FeedbackStatus status) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "Feedback not found"));
        feedback.updateStatus(status);
    }
}
