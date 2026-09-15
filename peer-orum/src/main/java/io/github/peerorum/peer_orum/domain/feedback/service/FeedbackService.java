package io.github.peerorum.peer_orum.domain.feedback.service;

import io.github.peerorum.peer_orum.domain.feedback.dto.AdminFeedbackResponse;
import io.github.peerorum.peer_orum.domain.feedback.dto.FeedbackCreateRequest;
import io.github.peerorum.peer_orum.domain.feedback.dto.MyFeedbackResponse;
import io.github.peerorum.peer_orum.domain.feedback.dto.PublishedFeedbackResponse;
import io.github.peerorum.peer_orum.domain.feedback.entity.Feedback;
import io.github.peerorum.peer_orum.domain.feedback.entity.FeedbackStatus;
import io.github.peerorum.peer_orum.domain.feedback.repository.FeedbackRepository;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
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
    private final UserRepository userRepository;

    @Transactional
    public void createFeedback(Long userId, FeedbackCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));

        Feedback feedback = Feedback.builder()
                .user(user)
                .content(request.getContent())
                .contact(request.getContact())
                .build();
        feedbackRepository.save(feedback);
    }

    @Transactional(readOnly = true)
    public List<PublishedFeedbackResponse> getPublishedFeedbacks() {
        return feedbackRepository.findAllByBoardSummaryIsNotNullOrderByPublishedAtDesc().stream()
                .map(PublishedFeedbackResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MyFeedbackResponse> getMyFeedbacks(Long userId) {
        return feedbackRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(MyFeedbackResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AdminFeedbackResponse> getAllFeedbacksForAdmin() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(AdminFeedbackResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateStatus(Long id, FeedbackStatus status) {
        Feedback feedback = findFeedbackOrThrow(id);
        feedback.updateStatus(status);
    }

    @Transactional
    public void answerFeedback(Long id, String answer) {
        Feedback feedback = findFeedbackOrThrow(id);
        feedback.answer(answer);
    }

    @Transactional
    public void publishFeedback(Long id, String summary) {
        Feedback feedback = findFeedbackOrThrow(id);
        feedback.publish(summary);
    }

    @Transactional
    public void unpublishFeedback(Long id) {
        Feedback feedback = findFeedbackOrThrow(id);
        feedback.unpublish();
    }

    private Feedback findFeedbackOrThrow(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "Feedback not found"));
    }
}
