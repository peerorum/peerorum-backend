package io.github.peerorum.peer_orum.domain.feedback.dto;

import io.github.peerorum.peer_orum.domain.feedback.entity.Feedback;
import io.github.peerorum.peer_orum.domain.feedback.entity.FeedbackStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MyFeedbackResponse {
    private Long id;
    private String content;
    private String contact;
    private FeedbackStatus status;
    private String answer;
    private LocalDateTime answeredAt;
    private String boardSummary;
    private LocalDateTime createdAt;

    public static MyFeedbackResponse from(Feedback feedback) {
        return MyFeedbackResponse.builder()
                .id(feedback.getId())
                .content(feedback.getContent())
                .contact(feedback.getContact())
                .status(feedback.getStatus())
                .answer(feedback.getAnswer())
                .answeredAt(feedback.getAnsweredAt())
                .boardSummary(feedback.getBoardSummary())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
