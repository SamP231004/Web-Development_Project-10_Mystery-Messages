package com.mysterymessages.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignUpRequest(
        @NotBlank @Size(min = 2, max = 20) @Pattern(regexp = "^[a-zA-Z0-9_]+$") String username,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6) String password
) {
}
