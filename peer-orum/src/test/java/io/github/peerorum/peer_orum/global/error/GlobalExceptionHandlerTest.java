package io.github.peerorum.peer_orum.global.error;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler globalExceptionHandler = new GlobalExceptionHandler();

    @Test
    @DisplayName("CustomException(AiIntegrationException) 발생 시 올바른 응답 반환 테스트")
    void handleCustomExceptionTest() {
        // given
        AiIntegrationException exception = new AiIntegrationException("API 호출 실패");

        // when
        ResponseEntity<ErrorResponse> responseEntity = globalExceptionHandler.handleBusinessException(exception);

        // then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().getCode()).isEqualTo("AI001");
        assertThat(responseEntity.getBody().getMessage()).isEqualTo("Gemini API Integration Error");
    }
}
