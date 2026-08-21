package io.github.peerorum.peer_orum.domain.user.repository;

import io.github.peerorum.peer_orum.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByAnonymousUuid(String anonymousUuid);
    boolean existsByVirtualNickname(String virtualNickname);
    long countByCreatedAtAfter(java.time.LocalDateTime date);
    java.util.List<User> findTop5ByOrderByCreatedAtDesc();
}
