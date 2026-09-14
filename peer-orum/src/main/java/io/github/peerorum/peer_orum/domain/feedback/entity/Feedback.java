package io.github.peerorum.peer_orum.domain.feedback.entity;

import io.github.peerorum.peer_orum.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Feedback extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String contact;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeedbackStatus status;

    private Long upvotes;

    @Builder
    public Feedback(String content, String contact) {
        this.content = content;
        this.contact = contact;
        this.status = FeedbackStatus.PENDING;
        this.upvotes = 0L;
    }

    public void updateStatus(FeedbackStatus status) {
        this.status = status;
    }

    public void incrementUpvotes() {
        this.upvotes++;
    }
}
