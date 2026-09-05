package io.github.peerorum.peer_orum.domain.comparison.dto;

import io.github.peerorum.peer_orum.domain.spec.entity.Activity;
import io.github.peerorum.peer_orum.domain.spec.entity.Certificate;
import io.github.peerorum.peer_orum.domain.spec.entity.Intern;
import io.github.peerorum.peer_orum.domain.spec.entity.Award;
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
    private Double gpa;
    private Integer toeicScore;

    private List<CertificateDto> certificates;
    private List<ActivityDto> activities;
    private List<InternDto> interns;
    private List<AwardDto> awards;

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
    
    @Getter
    @Builder
    public static class InternDto {
        private String company;
        private String detail;
        
        public static InternDto from(Intern intern) {
            return InternDto.builder()
                    .company(intern.getCompany())
                    .detail(intern.getDetail())
                    .build();
        }
    }

    @Getter
    @Builder
    public static class AwardDto {
        private String awardName;
        private String detail;
        
        public static AwardDto from(Award award) {
            return AwardDto.builder()
                    .awardName(award.getName())
                    .detail(award.getDetail())
                    .build();
        }
    }
}
