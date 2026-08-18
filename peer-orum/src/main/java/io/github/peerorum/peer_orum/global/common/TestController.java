package io.github.peerorum.peer_orum.global.common;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping
    public ApiResponse<String> testConnection() {
        return ApiResponse.success("Backend connection successful!", null);
    }
}
