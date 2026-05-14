package com.mysterymessages.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendMessageRequest(
        @NotBlank String username,
        @NotBlank @Size(min = 10, max = 300) String content
) {
}
