package io.github.peerorum.peer_orum.domain.feedback.dto;

import io.github.peerorum.peer_orum.domain.feedback.entity.Feedback;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PublishedFeedbackResponse {
    private Long id;
    private String boardSummary;
    private LocalDateTime publishedAt;

    public static PublishedFeedbackResponse from(Feedback feedback) {
        return PublishedFeedbackResponse.builder()
                .id(feedback.getId())
                .boardSummary(feedback.getBoardSummary())
                .publishedAt(feedback.getPublishedAt())
                .build();
    }
}
