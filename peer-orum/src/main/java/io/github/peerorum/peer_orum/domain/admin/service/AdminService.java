package io.github.peerorum.peer_orum.domain.admin.service;

import io.github.peerorum.peer_orum.domain.admin.dto.AdminDashboardResponse;
import io.github.peerorum.peer_orum.domain.admin.dto.AdminUserDto;
import io.github.peerorum.peer_orum.domain.admin.dto.AdminUserResponse;
import io.github.peerorum.peer_orum.domain.spec.repository.SpecProfileRepository;
import io.github.peerorum.peer_orum.domain.user.entity.User;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final SpecProfileRepository specProfileRepository;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboardStatistics() {
        long totalUsers = userRepository.count();
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        long newSignups = userRepository.countByCreatedAtAfter(startOfDay);
        long totalSpecCards = specProfileRepository.count();
        
        List<User> recentUsers = userRepository.findTop5ByOrderByCreatedAtDesc();
        List<AdminDashboardResponse.RecentSignupDto> recentSignups = recentUsers.stream()
                .map(user -> AdminDashboardResponse.RecentSignupDto.builder()
                        .name(user.getName() != null ? user.getName() : "익명")
                        .handle(user.getVirtualNickname())
                        .time(formatTimeAgo(user.getCreatedAt()))
                        .build())
                .collect(Collectors.toList());

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .newSignups(newSignups)
                .totalSpecCards(totalSpecCards)
                .reportCount(32) // Mock data for now
                .recentSignups(recentSignups)
                .build();
    }

    @Transactional(readOnly = true)
    public AdminUserResponse getUsers(Pageable pageable) {
        Page<User> userPage = userRepository.findAll(pageable);

        List<AdminUserDto> userDtos = userPage.getContent().stream()
                .map(user -> {
                    // For now, mapping basic user info. Real implementation should join with SchoolAuth/SpecProfile for school/major.
                    return AdminUserDto.builder()
                            .id(user.getVirtualNickname())
                            .name(user.getName() != null ? user.getName() : "익명")
                            .school("미등록") // To be fetched from SchoolAuth or SpecProfile
                            .major("미등록") // To be fetched from SpecProfile
                            .grade("-")
                            .joinedAt(user.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
                            .status(user.getRole().name().equals("ROLE_USER") ? "활성" : "대기")
                            .verified("인증대기") // Logic for verification status
                            .build();
                })
                .collect(Collectors.toList());

        return AdminUserResponse.builder()
                .users(userDtos)
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .currentPage(userPage.getNumber())
                .build();
    }

    private String formatTimeAgo(LocalDateTime createdAt) {
        if (createdAt == null) return "방금 전";
        long minutes = ChronoUnit.MINUTES.between(createdAt, LocalDateTime.now());
        if (minutes < 60) return minutes + "분 전";
        long hours = ChronoUnit.HOURS.between(createdAt, LocalDateTime.now());
        if (hours < 24) return hours + "시간 전";
        long days = ChronoUnit.DAYS.between(createdAt, LocalDateTime.now());
        return days + "일 전";
    }
}
