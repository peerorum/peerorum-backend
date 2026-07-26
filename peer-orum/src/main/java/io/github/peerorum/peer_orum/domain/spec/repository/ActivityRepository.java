package io.github.peerorum.peer_orum.domain.spec.repository;

import io.github.peerorum.peer_orum.domain.spec.entity.Activity;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUser(User user);
}
