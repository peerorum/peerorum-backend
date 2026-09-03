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
public class Award extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    private String host;
    
    private String awardDate;

    @Column(columnDefinition = "TEXT")
    private String detail;

    @Builder
    public Award(User user, String name, String host, String awardDate, String detail) {
        this.user = user;
        this.name = name;
        this.host = host;
        this.awardDate = awardDate;
        this.detail = detail;
    }
}
