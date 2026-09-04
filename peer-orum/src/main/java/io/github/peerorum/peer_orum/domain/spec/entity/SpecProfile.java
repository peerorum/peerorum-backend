package io.github.peerorum.peer_orum.domain.spec.entity;

import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class SpecProfile extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

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

    @Builder
    public SpecProfile(User user, String university, String major, Integer entranceYear, 
                       Double gpa, Double majorGpa, Double convertedScore,
                       Integer toeicScore, String opicGrade, 
                       String toeicSpeakingGrade, String desiredJob) {
        this.user = user;
        this.university = university;
        this.major = major;
        this.entranceYear = entranceYear;
        this.gpa = gpa;
        this.majorGpa = majorGpa;
        this.convertedScore = convertedScore;
        this.toeicScore = toeicScore;
        this.opicGrade = opicGrade;
        this.toeicSpeakingGrade = toeicSpeakingGrade;
        this.desiredJob = desiredJob;
    }

    public void updateSpec(Double gpa, Integer toeicScore, String opicGrade, 
                           String toeicSpeakingGrade, String desiredJob) {
        this.gpa = gpa;
        this.toeicScore = toeicScore;
        this.opicGrade = opicGrade;
        this.toeicSpeakingGrade = toeicSpeakingGrade;
        this.desiredJob = desiredJob;
    }

    public void updateDesiredJob(String desiredJob) {
        if (desiredJob != null) this.desiredJob = desiredJob;
    }

    public void updateEntranceYear(Integer entranceYear) {
        if (entranceYear != null) this.entranceYear = entranceYear;
    }

    public void updateGpa(Double gpa, Double convertedScore, Double majorGpa) {
        this.gpa = gpa;
        this.convertedScore = convertedScore;
        this.majorGpa = majorGpa;
    }

    public void updateLanguageScore(Integer toeicScore, String opicGrade, String toeicSpeakingGrade) {
        if (toeicScore != null) this.toeicScore = toeicScore;
        if (opicGrade != null) this.opicGrade = opicGrade;
        if (toeicSpeakingGrade != null) this.toeicSpeakingGrade = toeicSpeakingGrade;
    }
}
