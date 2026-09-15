package io.github.peerorum.peer_orum.domain.feedback.entity;

import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Feedback extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String contact;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeedbackStatus status;

    @Column(columnDefinition = "TEXT")
    private String answer;

    private LocalDateTime answeredAt;

    @Column(columnDefinition = "TEXT")
    private String boardSummary;

    private LocalDateTime publishedAt;

    @Builder
    public Feedback(User user, String content, String contact) {
        this.user = user;
        this.content = content;
        this.contact = contact;
        this.status = FeedbackStatus.PENDING;
    }

    public void updateStatus(FeedbackStatus status) {
        this.status = status;
    }

    public void answer(String answer) {
        this.answer = answer;
        this.answeredAt = LocalDateTime.now();
    }

    public void publish(String summary) {
        this.boardSummary = summary;
        this.publishedAt = LocalDateTime.now();
    }

    public void unpublish() {
        this.boardSummary = null;
        this.publishedAt = null;
    }
}
