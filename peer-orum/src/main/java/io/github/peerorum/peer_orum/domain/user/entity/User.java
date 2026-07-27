package io.github.peerorum.peer_orum.domain.user.entity;

import io.github.peerorum.peer_orum.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "users")
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider;

    @Column(nullable = false)
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Anonymous Identity
    @Column(nullable = false, unique = true, updatable = false)
    private String anonymousUuid;

    @Column(nullable = false, unique = true)
    private String virtualNickname;

    @Builder
    public User(String email, String name, Provider provider, String providerId, Role role, String virtualNickname) {
        this.email = email;
        this.name = name;
        this.provider = provider;
        this.providerId = providerId;
        this.role = role;
        this.anonymousUuid = UUID.randomUUID().toString();
        this.virtualNickname = virtualNickname;
    }

    public void updateVirtualNickname(String newNickname) {
        this.virtualNickname = newNickname;
    }
    
    public void updateRole(Role role) {
        this.role = role;
    }
}
