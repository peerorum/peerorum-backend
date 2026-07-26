package io.github.peerorum.peer_orum.domain.comparison.controller;

import io.github.peerorum.peer_orum.domain.comparison.dto.ComparisonStatisticsResponse;
import io.github.peerorum.peer_orum.domain.comparison.service.ComparisonService;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.global.common.ApiResponse;
import io.github.peerorum.peer_orum.global.error.CustomException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Comparison API", description = "Anonymous Spec Comparison and Statistics")
@RestController
@RequestMapping("/api/comparison")
@RequiredArgsConstructor
public class ComparisonController {

    private final ComparisonService comparisonService;
    private final UserRepository userRepository;

    @Operation(summary = "Get Peer Statistics", description = "Get statistics of peers in the same group (same university, major, year, desired job)")
    @GetMapping("/statistics")
    public ApiResponse<ComparisonStatisticsResponse> getStatistics(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.UNAUTHORIZED));

        ComparisonStatisticsResponse response = comparisonService.getComparisonStatistics(user.getId());
        
        return ApiResponse.success(response);
    }
}
