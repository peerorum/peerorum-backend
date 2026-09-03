package io.github.peerorum.peer_orum.domain.spec.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AwardVerificationRequest {
    private String name;
    private String host;
    private String date;
    private String detail;
}
