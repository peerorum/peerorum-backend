package io.github.peerorum.peer_orum.global.error;

public class AiIntegrationException extends CustomException {
    public AiIntegrationException(String message) {
        super(ErrorCode.GEMINI_API_ERROR);
    }
    
    public AiIntegrationException() {
        super(ErrorCode.GEMINI_API_ERROR);
    }
}
