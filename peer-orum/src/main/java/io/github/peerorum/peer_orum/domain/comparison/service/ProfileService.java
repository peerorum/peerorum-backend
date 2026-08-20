package io.github.peerorum.peer_orum.domain.comparison.service;

import io.github.peerorum.peer_orum.domain.user.entity.Role;
import io.github.peerorum.peer_orum.domain.comparison.dto.ProfileCreateRequest;
import io.github.peerorum.peer_orum.domain.spec.entity.SpecProfile;
import io.github.peerorum.peer_orum.domain.spec.repository.SpecProfileRepository;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class ProfileService {

    private final SpecProfileRepository specProfileRepository;
    private final UserRepository userRepository;

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
}
