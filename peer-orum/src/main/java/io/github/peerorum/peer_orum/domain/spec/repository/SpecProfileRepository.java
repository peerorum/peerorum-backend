package io.github.peerorum.peer_orum.domain.spec.repository;

import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpecProfileRepository extends JpaRepository<SpecProfile, Long>, SpecProfileCustomRepository {
    Optional<SpecProfile> findByUser(User user);
}
