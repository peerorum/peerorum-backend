package io.github.peerorum.peer_orum.domain.comparison.dto;

import io.github.peerorum.peer_orum.domain.spec.dto.ActivityVerificationRequest;
import io.github.peerorum.peer_orum.domain.spec.dto.CertificateVerificationRequest;
import io.github.peerorum.peer_orum.domain.spec.entity.Activity;
import io.github.peerorum.peer_orum.domain.spec.entity.Certificate;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ProfileDetailResponse {
    private String anonymousUuid;
    private String virtualNickname;
    private String university;
    private String major;
    private Integer entranceYear;
    private String desiredJob;
    private double gpa;
    private int toeicScore;

    private List<CertificateDto> certificates;
    private List<ActivityDto> activities;

    @Getter
    @Builder
    public static class CertificateDto {
        private String certName;
        private String status;
        
        public static CertificateDto from(Certificate cert) {
            return CertificateDto.builder()
                    .certName(cert.getCertName())
                    .status(cert.getStatus().name())
                    .build();
        }
    }

    @Getter
    @Builder
    public static class ActivityDto {
        private String activityName;
        private String status;

        public static ActivityDto from(Activity activity) {
            return ActivityDto.builder()
                    .activityName(activity.getActivityName())
                    .status(activity.getStatus().name())
                    .build();
        }
    }
}
