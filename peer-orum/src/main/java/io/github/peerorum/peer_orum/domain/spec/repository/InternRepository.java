package io.github.peerorum.peer_orum.domain.spec.repository;

import io.github.peerorum.peer_orum.domain.spec.entity.Intern;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InternRepository extends JpaRepository<Intern, Long> {
    List<Intern> findByUser(User user);
    void deleteByUser(User user);
}
