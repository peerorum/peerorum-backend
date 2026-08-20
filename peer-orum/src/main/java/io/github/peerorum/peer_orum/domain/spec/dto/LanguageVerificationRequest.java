package io.github.peerorum.peer_orum.domain.spec.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguageVerificationRequest {
    private String testName;
    private String score;
    private String date;
}
