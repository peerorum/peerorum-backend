package io.github.peerorum.peer_orum.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private List<AdminUserDto> users;
    private long totalElements;
    private int totalPages;
    private int currentPage;
}
