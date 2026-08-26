package io.github.peerorum.peer_orum.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminVerificationDto {
    private String id;
    private String name;
    private String handle;
    private String type;
    private String file;
    private String submittedAt;
    private String status;
}
