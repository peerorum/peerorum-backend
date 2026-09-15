package io.github.peerorum.peer_orum.domain.feedback.dto;

import io.github.peerorum.peer_orum.domain.feedback.entity.Feedback;
import io.github.peerorum.peer_orum.domain.feedback.entity.FeedbackStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminFeedbackResponse {
    private Long id;
    private String authorNickname;
    private String content;
    private String contact;
    private FeedbackStatus status;
    private String answer;
    private LocalDateTime answeredAt;
    private String boardSummary;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;

    public static AdminFeedbackResponse from(Feedback feedback) {
        return AdminFeedbackResponse.builder()
                .id(feedback.getId())
                .authorNickname(feedback.getUser() != null ? feedback.getUser().getVirtualNickname() : null)
                .content(feedback.getContent())
                .contact(feedback.getContact())
                .status(feedback.getStatus())
                .answer(feedback.getAnswer())
                .answeredAt(feedback.getAnsweredAt())
                .boardSummary(feedback.getBoardSummary())
                .publishedAt(feedback.getPublishedAt())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
