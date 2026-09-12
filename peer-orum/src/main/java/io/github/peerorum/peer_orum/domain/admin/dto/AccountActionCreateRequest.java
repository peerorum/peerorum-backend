package io.github.peerorum.peer_orum.domain.admin.dto;

public record AccountActionCreateRequest(Long userId, String type, String reason) {
}
