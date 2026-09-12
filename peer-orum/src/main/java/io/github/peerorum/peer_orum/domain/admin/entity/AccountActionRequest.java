package io.github.peerorum.peer_orum.domain.admin.entity;

import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "account_action_requests")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AccountActionRequest extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountActionType type;

    @Column(nullable = false, length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountActionStatus status;

    private LocalDateTime reviewedAt;
    private String reviewerEmail;

    @Builder
    public AccountActionRequest(User user, AccountActionType type, String reason) {
        this.user = user;
        this.type = type;
        this.reason = reason;
        this.status = AccountActionStatus.PENDING;
    }

    public void decide(AccountActionStatus status, String reviewerEmail) {
        if (this.status != AccountActionStatus.PENDING) {
            throw new IllegalStateException("이미 처리된 요청입니다.");
        }
        this.status = status;
        this.reviewerEmail = reviewerEmail;
        this.reviewedAt = LocalDateTime.now();
    }
}
