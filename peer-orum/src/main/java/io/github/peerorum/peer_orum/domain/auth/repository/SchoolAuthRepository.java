package io.github.peerorum.peer_orum.domain.auth.repository;

import io.github.peerorum.peer_orum.domain.auth.entity.SchoolAuth;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SchoolAuthRepository extends JpaRepository<SchoolAuth, Long> {
    Optional<SchoolAuth> findByUser(User user);
    Optional<SchoolAuth> findByUniversityEmail(String universityEmail);
    Optional<SchoolAuth> findByVerificationToken(String token);
}
