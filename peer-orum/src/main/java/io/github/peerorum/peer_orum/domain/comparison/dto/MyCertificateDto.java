package io.github.peerorum.peer_orum.domain.comparison.dto;

import io.github.peerorum.peer_orum.domain.spec.entity.Certificate;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class MyCertificateDto {
    private Long id;
    private String certName;
    private String certNo;
    private LocalDate issueDate;
    private String status;
    private String fileUrl;

    public static MyCertificateDto from(Certificate certificate) {
        return MyCertificateDto.builder()
                .id(certificate.getId())
                .certName(certificate.getCertName())
                .certNo(certificate.getCertNo())
                .issueDate(certificate.getIssueDate())
                .status(certificate.getStatus().name())
                .fileUrl(certificate.getFileUrl())
                .build();
    }
}
