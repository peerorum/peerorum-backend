package io.github.peerorum.peer_orum.domain.comparison.service;

import io.github.peerorum.peer_orum.domain.user.entity.Role;
import io.github.peerorum.peer_orum.domain.comparison.dto.MyProfileResponse;
import io.github.peerorum.peer_orum.domain.comparison.dto.ProfileCreateRequest;
import io.github.peerorum.peer_orum.domain.spec.entity.Activity;
import io.github.peerorum.peer_orum.domain.spec.entity.Award;
import io.github.peerorum.peer_orum.domain.spec.entity.Certificate;
import io.github.peerorum.peer_orum.domain.spec.entity.Intern;
import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import io.github.peerorum.peer_orum.domain.spec.repository.ActivityRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.AwardRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.CertificateRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.InternRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.SpecProfileRepository;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProfileService {

    private final SpecProfileRepository specProfileRepository;
    private final UserRepository userRepository;
    private final CertificateRepository certificateRepository;
    private final ActivityRepository activityRepository;
    private final InternRepository internRepository;
    private final AwardRepository awardRepository;

    @Transactional
    public void createProfile(Long userId, ProfileCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        if (specProfileRepository.findByUser(user).isPresent()) {
            user.updateRole(Role.ROLE_USER);
            return;
        }

        SpecProfile newProfile = SpecProfile.builder()
                .user(user)
                .university(request.getUniversity())
                .major(request.getMajor())
                .entranceYear(request.getEntranceYear())
                .desiredJob(request.getDesiredJob())
                .build();

        specProfileRepository.save(newProfile);
        
        if (request.getNickname() != null && !request.getNickname().trim().isEmpty()) {
            user.updateVirtualNickname(request.getNickname());
        }
        user.updateRole(Role.ROLE_USER);
    }

    @Transactional(readOnly = true)
    public MyProfileResponse getMyProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        SpecProfile specProfile = specProfileRepository.findByUser(user)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "SpecProfile not found"));

        List<Certificate> certificates = certificateRepository.findByUser(user);
        List<Activity> activities = activityRepository.findByUser(user);
        List<Intern> interns = internRepository.findByUser(user);
        List<Award> awards = awardRepository.findByUser(user);

        return MyProfileResponse.from(specProfile, certificates, activities, interns, awards);
    }

    @Transactional
    public void updateProfile(Long userId, String nickname, String desiredJob, Integer entranceYear) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.ENTITY_NOT_FOUND, "User not found"));

        if (nickname != null && !nickname.trim().isEmpty()) {
            user.updateVirtualNickname(nickname.trim());
        }

        specProfileRepository.findByUser(user).ifPresent(profile -> {
            if (desiredJob != null) profile.updateDesiredJob(desiredJob);
            if (entranceYear != null) profile.updateEntranceYear(entranceYear);
        });
    }
}