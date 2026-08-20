package io.github.peerorum.peer_orum.domain.admin.controller;

import io.github.peerorum.peer_orum.global.common.ApiResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @GetMapping("/test")
    public ApiResponse<String> testAdminAccess() {
        return ApiResponse.success(
                "Admin access granted"
        );
    }
}