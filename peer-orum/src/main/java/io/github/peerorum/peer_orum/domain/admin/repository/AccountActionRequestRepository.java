package io.github.peerorum.peer_orum.domain.admin.repository;

import io.github.peerorum.peer_orum.domain.admin.entity.AccountActionRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountActionRequestRepository extends JpaRepository<AccountActionRequest, Long> {
}
