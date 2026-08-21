package io.github.peerorum.peer_orum.domain.comparison.service;

import io.github.peerorum.peer_orum.domain.user.entity.Role;
import io.github.peerorum.peer_orum.domain.comparison.dto.MyProfileResponse;
import io.github.peerorum.peer_orum.domain.comparison.dto.ProfileCreateRequest;
import io.github.peerorum.peer_orum.domain.spec.entity.Activity;
import io.github.peerorum.peer_orum.domain.spec.entity.Certificate;
import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import io.github.peerorum.peer_orum.domain.spec.repository.ActivityRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.CertificateRepository;
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

        return MyProfileResponse.from(specProfile, certificates, activities);
    }
}
