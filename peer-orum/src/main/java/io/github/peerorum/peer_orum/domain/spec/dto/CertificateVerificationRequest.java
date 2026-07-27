package io.github.peerorum.peer_orum.domain.spec.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class CertificateVerificationRequest {
    private String certName;
    private String certNo;
    private LocalDate issueDate;
}
