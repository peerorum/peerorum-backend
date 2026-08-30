package io.github.peerorum.peer_orum.domain.ai.controller;

import io.github.peerorum.peer_orum.domain.ai.dto.AiJobInfoResponse;
import io.github.peerorum.peer_orum.domain.ai.service.AiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AiControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AiService aiService;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(new AiController(aiService))
                .build();
    }

    @Test
    @DisplayName("직무 정보 제공 API 호출 테스트")
    void getJobInfo() throws Exception {
        // given
        String jobName = "마케팅";
        AiJobInfoResponse response = AiJobInfoResponse.builder()
                .jobName(jobName)
                .description("마케팅 직무입니다.")
                .keyTasks(List.of("시장 분석", "캠페인 기획"))
                .requiredCompetencies(List.of("데이터 분석 능력", "창의력"))
                .build();

        given(aiService.getJobInfo(jobName)).willReturn(response);

        // when & then
        mockMvc.perform(get("/api/v1/ai/job-info")
                        .param("jobName", jobName))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jobName").value(jobName))
                .andExpect(jsonPath("$.description").value("마케팅 직무입니다."))
                .andExpect(jsonPath("$.keyTasks[0]").value("시장 분석"))
                .andExpect(jsonPath("$.requiredCompetencies[0]").value("데이터 분석 능력"));
    }
}
