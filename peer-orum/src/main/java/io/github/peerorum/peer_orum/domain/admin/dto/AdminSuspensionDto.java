package io.github.peerorum.peer_orum.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminSuspensionDto {
    private String id;
    private String name;
    private String school;
    private String type;
    private String reason;
    private String requestedAt;
    private String status;
}
