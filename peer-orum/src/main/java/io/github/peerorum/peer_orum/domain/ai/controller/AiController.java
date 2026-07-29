package io.github.peerorum.peer_orum.domain.ai.controller;

import io.github.peerorum.peer_orum.domain.ai.dto.AiJobInfoResponse;
import io.github.peerorum.peer_orum.domain.ai.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "AI", description = "AI 기반 직무 정보 제공 API")
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @Operation(summary = "희망 직무 기반 정보 제공", description = "희망 직무 이름을 기반으로 AI가 분석한 직무 정보를 제공합니다.")
    @GetMapping("/job-info")
    public ResponseEntity<AiJobInfoResponse> getJobInfo(@RequestParam("jobName") String jobName) {
        AiJobInfoResponse response = aiService.getJobInfo(jobName);
        return ResponseEntity.ok(response);
    }
}
