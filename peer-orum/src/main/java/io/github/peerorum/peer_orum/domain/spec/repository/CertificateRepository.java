package io.github.peerorum.peer_orum.domain.spec.repository;

import io.github.peerorum.peer_orum.domain.spec.entity.Certificate;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByUser(User user);
}
