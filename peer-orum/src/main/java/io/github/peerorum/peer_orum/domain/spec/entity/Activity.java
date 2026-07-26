package io.github.peerorum.peer_orum.domain.spec.entity;

import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Activity extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String activityName;

    @Column(nullable = false)
    private String authKey; // 증명서 번호 또는 인증키

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus status;

    @Builder
    public Activity(User user, String activityName, String authKey) {
        this.user = user;
        this.activityName = activityName;
        this.authKey = authKey;
        this.status = VerificationStatus.PENDING;
    }

    public void updateStatus(VerificationStatus status) {
        this.status = status;
    }
}
