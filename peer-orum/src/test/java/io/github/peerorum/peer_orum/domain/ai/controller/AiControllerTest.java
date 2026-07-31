package io.github.peerorum.peer_orum.domain.ai.controller;

import io.github.peerorum.peer_orum.domain.auth.repository.SchoolAuthRepository;
import io.github.peerorum.peer_orum.domain.spec.repository.SpecProfileRepository;
import io.github.peerorum.peer_orum.domain.user.repository.UserRepository;
import io.github.peerorum.peer_orum.domain.ai.dto.AiJobInfoResponse;
import io.github.peerorum.peer_orum.domain.ai.service.AiService;
import io.github.peerorum.peer_orum.global.interceptor.GiveToGetInterceptor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(AiController.class)
@AutoConfigureMockMvc(addFilters = false) // Security Filter 무시
class AiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AiService aiService;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private SpecProfileRepository specProfileRepository;

    @MockitoBean
    private SchoolAuthRepository schoolAuthRepository;

    @MockitoBean
    private GiveToGetInterceptor giveToGetInterceptor;

    @MockitoBean
    private JpaMetamodelMappingContext jpaMetamodelMappingContext;

    @BeforeEach
    void setUp() throws Exception {
        when(giveToGetInterceptor.preHandle(any(), any(), any()))
                .thenReturn(true);
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
