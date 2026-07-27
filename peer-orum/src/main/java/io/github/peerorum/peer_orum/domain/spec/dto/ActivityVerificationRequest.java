package io.github.peerorum.peer_orum.domain.spec.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ActivityVerificationRequest {
    private String activityName;
    private String authKey;
}
