package io.github.peerorum.peer_orum.domain.comparison.dto;

import io.github.peerorum.peer_orum.domain.spec.entity.Activity;
import io.github.peerorum.peer_orum.domain.spec.entity.Certificate;
import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class MyProfileResponse {
    private String name;
    private String university;
    private String major;
    private Integer entranceYear;
    
    // Academic
    private Double gpa;

    // Language
    private Integer toeicScore;
    private String opicGrade;
    private String toeicSpeakingGrade;

    // Career Goal
    private String desiredJob;

    private List<MyCertificateDto> certificates;
    private List<MyActivityDto> activities;

    public static MyProfileResponse from(SpecProfile specProfile, List<Certificate> certificates, List<Activity> activities) {
        return MyProfileResponse.builder()
                .name(specProfile.getUser().getName())
                .university(specProfile.getUniversity())
                .major(specProfile.getMajor())
                .entranceYear(specProfile.getEntranceYear())
                .gpa(specProfile.getGpa())
                .toeicScore(specProfile.getToeicScore())
                .opicGrade(specProfile.getOpicGrade())
                .toeicSpeakingGrade(specProfile.getToeicSpeakingGrade())
                .desiredJob(specProfile.getDesiredJob())
                .certificates(certificates.stream().map(MyCertificateDto::from).collect(Collectors.toList()))
                .activities(activities.stream().map(MyActivityDto::from).collect(Collectors.toList()))
                .build();
    }
}
