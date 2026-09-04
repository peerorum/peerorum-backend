package io.github.peerorum.peer_orum.domain.comparison.controller;

import io.github.peerorum.peer_orum.domain.comparison.dto.ProfileCreateRequest;
import io.github.peerorum.peer_orum.domain.comparison.service.ProfileService;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.common.ApiResponse;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Profile API", description = "User Spec Profile Management")
@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final UserRepository userRepository;

    @Operation(summary = "Create Spec Profile", description = "Create initial spec profile (University, Major, Entrance Year, Desired Job)")
    @PostMapping
    public ApiResponse<Void> createProfile(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
                                           @RequestBody ProfileCreateRequest request) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));
        
        profileService.createProfile(user.getId(), request);
        
        return ApiResponse.success("Profile created successfully", null);
    }
    @Operation(summary = "Get My Profile", description = "Get the current user's profile and spec details")
    @GetMapping("/me")
    public ApiResponse<io.github.peerorum.peer_orum.domain.comparison.dto.MyProfileResponse> getMyProfile(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));
        
        return ApiResponse.success("Profile retrieved successfully", profileService.getMyProfile(user.getId()));
    }

    @Operation(summary = "Update My Profile", description = "Update nickname, desiredJob, and grade")
    @PutMapping("/me")
    public ApiResponse<Void> updateProfile(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
                                           @RequestBody java.util.Map<String, Object> request) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));

        String nickname = (String) request.get("nickname");
        String desiredJob = (String) request.get("desiredJob");
        Integer entranceYear = request.get("entranceYear") != null 
                ? Integer.valueOf(request.get("entranceYear").toString()) : null;

        profileService.updateProfile(user.getId(), nickname, desiredJob, entranceYear);

        return ApiResponse.success("Profile updated successfully", null);
    }
}
