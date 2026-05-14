package com.mysterymessages.api.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyCodeRequest(
        @NotBlank String username,
        @NotBlank String code
) {
}
