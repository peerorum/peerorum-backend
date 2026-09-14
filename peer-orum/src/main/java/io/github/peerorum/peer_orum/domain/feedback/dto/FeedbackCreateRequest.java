package io.github.peerorum.peer_orum.domain.feedback.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class FeedbackCreateRequest {
    private String content;
    private String contact;
}
