package io.github.peerorum.peer_orum.domain.admin.controller;

import io.github.peerorum.peer_orum.domain.admin.dto.*;
import io.github.peerorum.peer_orum.domain.admin.service.AdminService;
import io.github.peerorum.peer_orum.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    @GetMapping("/dashboard") public ApiResponse<AdminDashboardResponse> getDashboard() { return ApiResponse.success(adminService.getDashboardStatistics()); }
    @GetMapping("/users") public ApiResponse<AdminUserResponse> getUsers(Pageable pageable, @RequestParam(required=false) String keyword, @RequestParam(required=false) String status, @RequestParam(required=false) Boolean verified, @RequestParam(required=false) Integer joinedWithinDays) { return ApiResponse.success(adminService.getUsers(pageable, keyword, status, verified, joinedWithinDays)); }
    @GetMapping("/verifications") public ApiResponse<AdminVerificationListResponse> getVerifications(@RequestParam(required=false) String keyword, @RequestParam(required=false) String status) { return ApiResponse.success(adminService.getVerifications(keyword, status)); }
    @PatchMapping("/verifications/{id}") public ApiResponse<Void> decideVerification(@PathVariable String id, @RequestBody AdminDecisionRequest request) { adminService.decideVerification(id, request.decision()); return ApiResponse.success(null); }
    @GetMapping("/suspensions") public ApiResponse<AdminSuspensionListResponse> getSuspensions(@RequestParam(required=false) String keyword, @RequestParam(required=false) String type, @RequestParam(required=false) String status) { return ApiResponse.success(adminService.getSuspensions(keyword, type, status)); }
    @PostMapping("/suspensions") public ApiResponse<Map<String, Long>> createAccountAction(@RequestBody AccountActionCreateRequest request) { return ApiResponse.success(Map.of("id", adminService.createAccountAction(request))); }
    @PatchMapping("/suspensions/{id}") public ApiResponse<Void> decideAccountAction(@PathVariable Long id, @RequestBody AdminDecisionRequest request, Authentication authentication) { adminService.decideAccountAction(id, request.decision(), authentication.getName()); return ApiResponse.success(null); }
}
