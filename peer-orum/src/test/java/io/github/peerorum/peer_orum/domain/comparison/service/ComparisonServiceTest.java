package io.github.peerorum.peer_orum.domain.comparison.service;

import io.github.peerorum.peer_orum.domain.comparison.dto.ProfileDetailResponse;
import io.github.peerorum.peer_orum.domain.comparison.dto.SpecProfileResponse;
import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import io.github.peerorum.peer_orum.domain.spec.repository.ActivityRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.AwardRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.CertificateRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.InternRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.SpecProfileRepository;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ComparisonServiceTest {

    private final SpecProfileRepository specProfileRepository = mock(SpecProfileRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final CertificateRepository certificateRepository = mock(CertificateRepository.class);
    private final ActivityRepository activityRepository = mock(ActivityRepository.class);
    private final InternRepository internRepository = mock(InternRepository.class);
    private final AwardRepository awardRepository = mock(AwardRepository.class);

    private final ComparisonService comparisonService = new ComparisonService(
            specProfileRepository,
            userRepository,
            certificateRepository,
            activityRepository,
            internRepository,
            awardRepository
    );

    @Test
    void profileDetailReturnsZeroPercentileWhenGpaIsMissing() {
        User targetUser = mock(User.class);
        SpecProfile target = profile(
                targetUser, "단국대학교", "소프트웨어학과", null
        );
        SpecProfile higherGpaProfile = profile(
                "단국대학교", "소프트웨어학과", 4.2
        );

        when(userRepository.findByAnonymousUuid("missing-gpa-uuid"))
                .thenReturn(Optional.of(targetUser));
        when(specProfileRepository.findByUser(targetUser))
                .thenReturn(Optional.of(target));
        when(specProfileRepository.findPeers(
                "단국대학교", "소프트웨어학과", null, null
        )).thenReturn(List.of(target, higherGpaProfile));
        when(certificateRepository.findByUser(targetUser)).thenReturn(List.of());
        when(activityRepository.findByUser(targetUser)).thenReturn(List.of());
        when(internRepository.findByUser(targetUser)).thenReturn(List.of());
        when(awardRepository.findByUser(targetUser)).thenReturn(List.of());

        ProfileDetailResponse result = comparisonService.getProfileDetail("missing-gpa-uuid");

        assertThat(result.getGpaPercentile()).isZero();
    }

    @Test
    void searchDefaultsMissingUniversityToDankookUniversityCohort() {
        SpecProfile target = profile("단국대학교", "소프트웨어학과", 3.6);
        List<SpecProfile> cohort = List.of(
                profile("단국대학교", "소프트웨어학과", 4.2),
                target,
                profile("단국대학교", "소프트웨어학과", 2.0)
        );

        when(specProfileRepository.searchPeers(
                "단국대학교", "소프트웨어학과", null, null, 3.5, 3.9
        )).thenReturn(List.of(target));
        when(specProfileRepository.findPeers(
                "단국대학교", "소프트웨어학과", null, null
        )).thenReturn(cohort);

        List<SpecProfileResponse> result = comparisonService.searchPeers(
                null, "소프트웨어학과", null, null, 3.5, 3.9
        );

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getGpaPercentile()).isEqualTo(67);
    }

    @Test
    void searchPercentileUsesWholeUniversityAndMajorCohortInsteadOfFilteredResults() {
        SpecProfile target = profile("단국대학교", "소프트웨어학과", 3.6);
        List<SpecProfile> cohort = List.of(
                profile("단국대학교", "소프트웨어학과", 4.2),
                target,
                profile("단국대학교", "소프트웨어학과", 3.6),
                profile("단국대학교", "소프트웨어학과", 2.0)
        );

        when(specProfileRepository.searchPeers(
                "단국대학교", "소프트웨어학과", null, null, 3.5, 3.9
        )).thenReturn(List.of(target));
        when(specProfileRepository.findPeers(
                "단국대학교", "소프트웨어학과", null, null
        )).thenReturn(cohort);

        List<SpecProfileResponse> result = comparisonService.searchPeers(
                "단국대학교", "소프트웨어학과", null, null, 3.5, 3.9
        );

        assertThat(result.get(0).getGpaPercentile())
                .isEqualTo(50);
    }

    @Test
    void profileDetailPercentileExcludesOtherUniversities() {
        User targetUser = mock(User.class);
        SpecProfile target = profile(targetUser, "단국대학교", "소프트웨어학과", 3.6);
        List<SpecProfile> sameUniversityAndMajor = List.of(
                profile("단국대학교", "소프트웨어학과", 4.2),
                target,
                profile("단국대학교", "소프트웨어학과", 2.0)
        );
        SpecProfile otherUniversity = profile("다른대학교", "소프트웨어학과", 4.5);

        when(userRepository.findByAnonymousUuid("target-uuid"))
                .thenReturn(Optional.of(targetUser));
        when(specProfileRepository.findByUser(targetUser))
                .thenReturn(Optional.of(target));
        when(specProfileRepository.findAll())
                .thenReturn(List.of(otherUniversity, sameUniversityAndMajor.get(0), target, sameUniversityAndMajor.get(2)));
        when(specProfileRepository.findPeers(
                "단국대학교", "소프트웨어학과", null, null
        )).thenReturn(sameUniversityAndMajor);
        when(certificateRepository.findByUser(targetUser)).thenReturn(List.of());
        when(activityRepository.findByUser(targetUser)).thenReturn(List.of());
        when(internRepository.findByUser(targetUser)).thenReturn(List.of());
        when(awardRepository.findByUser(targetUser)).thenReturn(List.of());

        ProfileDetailResponse result = comparisonService.getProfileDetail("target-uuid");

        assertThat(result.getGpaPercentile()).isEqualTo(67);
    }

    private SpecProfile profile(String university, String major, Double gpa) {
        return profile(mock(User.class), university, major, gpa);
    }

    private SpecProfile profile(User user, String university, String major, Double gpa) {
        SpecProfile profile = mock(SpecProfile.class);
        when(profile.getUser()).thenReturn(user);
        when(profile.getUniversity()).thenReturn(university);
        when(profile.getMajor()).thenReturn(major);
        when(profile.getGpa()).thenReturn(gpa);
        return profile;
    }
}
