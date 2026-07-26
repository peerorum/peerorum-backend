package io.github.peerorum.peer_orum.domain.auth.entity;

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
public class SchoolAuth extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String universityEmail;

    @Column(nullable = false)
    private String verificationToken;

    @Column(nullable = false)
    private boolean verified;

    private LocalDateTime verifiedAt;

    @Builder
    public SchoolAuth(User user, String universityEmail, String verificationToken) {
        this.user = user;
        this.universityEmail = universityEmail;
        this.verificationToken = verificationToken;
        this.verified = false;
    }

    public void verify() {
        this.verified = true;
        this.verifiedAt = LocalDateTime.now();
    }

    public void updateToken(String newToken) {
        this.verificationToken = newToken;
        this.verified = false;
        this.verifiedAt = null;
    }
}
