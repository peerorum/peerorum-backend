package io.github.peerorum.peer_orum.domain.feedback.dto;

import io.github.peerorum.peer_orum.domain.feedback.entity.Feedback;
import io.github.peerorum.peer_orum.domain.feedback.entity.FeedbackStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class FeedbackResponse {
    private Long id;
    private String content;
    private String contact;
    private FeedbackStatus status;
    private Long upvotes;
    private LocalDateTime createdAt;

    public static FeedbackResponse from(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .content(feedback.getContent())
                .contact(feedback.getContact())
                .status(feedback.getStatus())
                .upvotes(feedback.getUpvotes())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
