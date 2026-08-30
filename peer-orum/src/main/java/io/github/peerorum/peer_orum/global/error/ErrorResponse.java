package io.github.peerorum.peer_orum.global.error;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.validation.BindingResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ErrorResponse {

    private String message;
    private String status;
    private List<FieldError> errors;
    private String code;

    private ErrorResponse(final ErrorCode code, final List<FieldError> errors) {
        this.message = code.getMessage();
        this.status = code.getStatus().toString();
        this.errors = errors;
        this.code = code.getCode();
    }

    private ErrorResponse(final ErrorCode code) {
        this.message = code.getMessage();
        this.status = code.getStatus().toString();
        this.code = code.getCode();
        this.errors = new ArrayList<>();
    }

    private ErrorResponse(final ErrorCode code, final String message) {
        this.message = message;
        this.status = code.getStatus().toString();
        this.code = code.getCode();
        this.errors = new ArrayList<>();
    }

    public static ErrorResponse of(final ErrorCode code, final BindingResult bindingResult) {
        return new ErrorResponse(code, FieldError.of(bindingResult));
    }

    public static ErrorResponse of(final ErrorCode code) {
        return new ErrorResponse(code);
    }

    public static ErrorResponse of(final ErrorCode code, final String message) {
        return new ErrorResponse(code, message);
    }

    public static ErrorResponse of(final ErrorCode code, final List<FieldError> errors) {
        return new ErrorResponse(code, errors);
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class FieldError {
        private String field;
        private String value;
        private String reason;

        private FieldError(final String field, final String value, final String reason) {
            this.field = field;
            this.value = value;
            this.reason = reason;
        }

        public static List<FieldError> of(final String field, final String value, final String reason) {
            List<FieldError> fieldErrors = new ArrayList<>();
            fieldErrors.add(new FieldError(field, value, reason));
            return fieldErrors;
        }

        private static List<FieldError> of(final BindingResult bindingResult) {
            final List<org.springframework.validation.FieldError> fieldErrors = bindingResult.getFieldErrors();
            return fieldErrors.stream()
                    .map(error -> new FieldError(
                            error.getField(),
                            sanitizeRejectedValue(
                                    error.getField(),
                                    error.getRejectedValue()
                            ),
                            error.getDefaultMessage()))
                    .collect(Collectors.toList());
        }

        private static String sanitizeRejectedValue(
                String field,
                Object rejectedValue
        ) {
            String normalizedField =
                    field.toLowerCase(Locale.ROOT);

            if (normalizedField.contains("password")
                    || normalizedField.contains("token")
                    || normalizedField.contains("secret")) {
                return "[REDACTED]";
            }

            return rejectedValue == null
                    ? ""
                    : rejectedValue.toString();
        }
    }
}
