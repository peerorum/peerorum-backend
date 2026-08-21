package io.github.peerorum.peer_orum.domain.admin.controller;

import io.github.peerorum.peer_orum.domain.admin.dto.AdminDashboardResponse;
import io.github.peerorum.peer_orum.domain.admin.dto.AdminUserResponse;
import io.github.peerorum.peer_orum.domain.admin.service.AdminService;
import io.github.peerorum.peer_orum.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ApiResponse<AdminDashboardResponse> getDashboard() {
        return ApiResponse.success(adminService.getDashboardStatistics());
    }

    @GetMapping("/users")
    public ApiResponse<AdminUserResponse> getUsers(Pageable pageable) {
        return ApiResponse.success(adminService.getUsers(pageable));
    }
}