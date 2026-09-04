package io.github.peerorum.peer_orum.domain.comparison.dto;

import io.github.peerorum.peer_orum.domain.spec.entity.Activity;
import io.github.peerorum.peer_orum.domain.spec.entity.Award;
import io.github.peerorum.peer_orum.domain.spec.entity.Certificate;
import io.github.peerorum.peer_orum.domain.spec.entity.Intern;
import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class MyProfileResponse {
    private String name;
    private String nickname;
    private String university;
    private String major;
    private Integer entranceYear;
    
    // Academic
    private Double gpa;
    private Double majorGpa;
    private Double convertedScore;

    // Language
    private Integer toeicScore;
    private String opicGrade;
    private String toeicSpeakingGrade;

    // Career Goal
    private String desiredJob;

    private List<MyCertificateDto> certificates;
    private List<MyActivityDto> activities;
    private List<MyInternDto> interns;
    private List<MyAwardDto> awards;

    public static MyProfileResponse from(SpecProfile specProfile, List<Certificate> certificates, List<Activity> activities, List<Intern> interns, List<Award> awards) {
        return MyProfileResponse.builder()
                .name(specProfile.getUser().getName())
                .nickname(specProfile.getUser().getVirtualNickname())
                .university(specProfile.getUniversity())
                .major(specProfile.getMajor())
                .entranceYear(specProfile.getEntranceYear())
                .gpa(specProfile.getGpa())
                .majorGpa(specProfile.getMajorGpa())
                .convertedScore(specProfile.getConvertedScore())
                .toeicScore(specProfile.getToeicScore())
                .opicGrade(specProfile.getOpicGrade())
                .toeicSpeakingGrade(specProfile.getToeicSpeakingGrade())
                .desiredJob(specProfile.getDesiredJob())
                .certificates(certificates.stream().map(MyCertificateDto::from).collect(Collectors.toList()))
                .activities(activities.stream().map(MyActivityDto::from).collect(Collectors.toList()))
                .interns(interns.stream().map(MyInternDto::from).collect(Collectors.toList()))
                .awards(awards.stream().map(MyAwardDto::from).collect(Collectors.toList()))
                .build();
    }
}
