package io.github.peerorum.peer_orum.domain.ai.service;

import tools.jackson.databind.ObjectMapper;
import io.github.peerorum.peer_orum.domain.ai.dto.AiJobInfoResponse;
import io.github.peerorum.peer_orum.global.error.AiIntegrationException;
import io.github.peerorum.peer_orum.global.error.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private AiService aiService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(aiService, "apiUrl", "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent");
        ReflectionTestUtils.setField(aiService, "apiKey", "dummy-key");
    }

    @Test
    @DisplayName("정상적으로 직무 정보를 가져오는지 테스트 (Gemini)")
    void getJobInfo_Success() throws Exception {
        // given
        String jobName = "마케팅";
        String jsonContent = "{\"description\":\"설명\",\"keyTasks\":[\"업무1\"],\"requiredCompetencies\":[\"역량1\"]}";
        
        Map<String, Object> textMap = Map.of("text", jsonContent);
        Map<String, Object> contentMap = Map.of("parts", List.of(textMap));
        Map<String, Object> candidateMap = Map.of("content", contentMap);
        Map<String, Object> responseBody = Map.of("candidates", List.of(candidateMap));
        
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        when(restTemplate.postForEntity(any(String.class), any(), eq(Map.class))).thenReturn(responseEntity);

        Map<String, Object> parsedMap = Map.of(
                "description", "설명",
                "keyTasks", List.of("업무1"),
                "requiredCompetencies", List.of("역량1")
        );
        when(objectMapper.readValue(jsonContent, Map.class)).thenReturn(parsedMap);

        // when
        AiJobInfoResponse response = aiService.getJobInfo(jobName);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getJobName()).isEqualTo(jobName);
        assertThat(response.getDescription()).isEqualTo("설명");
        assertThat(response.getKeyTasks()).containsExactly("업무1");
        assertThat(response.getRequiredCompetencies()).containsExactly("역량1");
    }

    @Test
    @DisplayName("API 통신 실패 시 예외 발생 테스트 (Gemini)")
    void getJobInfo_Fail_ApiError() {
        // given
        String jobName = "개발자";
        ResponseEntity<Map> responseEntity = new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        when(restTemplate.postForEntity(any(String.class), any(), eq(Map.class))).thenReturn(responseEntity);

        // when & then
        assertThatThrownBy(() -> aiService.getJobInfo(jobName))
                .isInstanceOf(AiIntegrationException.class)
                .hasMessage(ErrorCode.GEMINI_API_ERROR.getMessage());
    }
}
