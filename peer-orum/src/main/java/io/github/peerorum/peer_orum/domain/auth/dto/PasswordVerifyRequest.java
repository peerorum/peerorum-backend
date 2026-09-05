package io.github.peerorum.peer_orum.domain.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordVerifyRequest {
    @NotBlank(message = "Password cannot be blank")
    private String password;
}
