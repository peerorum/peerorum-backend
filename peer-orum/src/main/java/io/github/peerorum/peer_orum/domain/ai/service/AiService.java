package io.github.peerorum.peer_orum.domain.ai.service;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import io.github.peerorum.peer_orum.domain.ai.dto.AiJobInfoResponse;
import io.github.peerorum.peer_orum.global.error.AiIntegrationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.key}")
    private String apiKey;

    public AiJobInfoResponse getJobInfo(String jobName) {
        String prompt = String.format(
            "당신은 직업 상담가입니다. 사용자가 희망하는 직무는 '%s'입니다. " +
            "이 직무에 대해 다음 정보를 JSON 형식으로만 제공해주세요. " +
            "다른 설명은 붙이지 말고 순수 JSON 객체만 반환하세요. " +
            "JSON 구조는 다음과 같아야 합니다: " +
            "{ \"description\": \"직무에 대한 간단한 설명(1~2문장)\", " +
            "\"keyTasks\": [\"주요 업무1\", \"주요 업무2\", \"주요 업무3\"], " +
            "\"requiredCompetencies\": [\"요구 역량1\", \"요구 역량2\", \"요구 역량3\"] }",
            jobName
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            ),
            "generationConfig", Map.of(
                "responseMimeType", "application/json"
            )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            // URL에 키를 쿼리 파라미터로 포함
            String requestUrl = apiUrl + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.postForEntity(requestUrl, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        String text = (String) parts.get(0).get("text");
                        return parseAiResponse(jobName, text);
                    }
                }
            }
            log.error("Failed to get valid response from Gemini API. Status: {}", response.getStatusCode());
            throw new AiIntegrationException("Gemini API returns empty or invalid format.");
        } catch (AiIntegrationException e) {
            throw e;
        }catch (Exception e) {
            log.error("Exception occurred while calling Gemini API", e);
            throw new AiIntegrationException("Failed to process Gemini API request: " + e.getMessage());
        }
    }

    private AiJobInfoResponse parseAiResponse(String jobName, String content) {
        try {
            Map<String, Object> jsonMap = objectMapper.readValue(content, Map.class);
            return AiJobInfoResponse.builder()
                    .jobName(jobName)
                    .description((String) jsonMap.get("description"))
                    .keyTasks((List<String>) jsonMap.get("keyTasks"))
                    .requiredCompetencies((List<String>) jsonMap.get("requiredCompetencies"))
                    .build();
        } catch (JacksonException e) {
            log.error("Failed to parse JSON response from AI. Content: {}", content, e);
            throw new AiIntegrationException("Failed to parse AI response.");
        }
    }

    public boolean verifyDocument(String userName, String documentType, String expectedDetails, byte[] fileBytes, String mimeType) {
        if (fileBytes == null || fileBytes.length == 0) {
            log.warn("Empty file bytes provided for document verification");
            return false;
        }

        String prompt = String.format(
            "이 이미지는 '%s' 증빙 자료입니다. " +
            "문서 내용 중 다음 정보가 정확히 일치하는지 분석해주세요: '%s'. " +
            "(주의: 화면 캡쳐본일 경우 이름이 안 보일 수 있으니, 이름이 안 보이더라도 위 정보만 일치하면 통과시키세요.) " +
            "정확히 일치하면 {\"verified\": true}, 아니면 {\"verified\": false}를 JSON 형식으로만 반환하세요.",
            documentType, expectedDetails
        );

        String base64Image = java.util.Base64.getEncoder().encodeToString(fileBytes);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt),
                    Map.of("inlineData", Map.of(
                        "mimeType", mimeType,
                        "data", base64Image
                    ))
                ))
            ),
            "generationConfig", Map.of(
                "responseMimeType", "application/json"
            )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            String requestUrl = apiUrl + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.postForEntity(requestUrl, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        String text = (String) parts.get(0).get("text");
                        log.info("Gemini verification response: {}", text);
                        Map<String, Object> jsonMap = objectMapper.readValue(text, Map.class);
                        Boolean verified = (Boolean) jsonMap.get("verified");
                        return verified != null && verified;
                    }
                }
            }
            log.error("Failed to get valid response from Gemini API for document verification. Status: {}", response.getStatusCode());
            return false;
        } catch (Exception e) {
            log.error("Exception occurred while calling Gemini API for document verification", e);
            return false;
        }
    }
}
