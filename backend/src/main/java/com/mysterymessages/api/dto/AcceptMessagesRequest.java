package com.mysterymessages.api.dto;

import jakarta.validation.constraints.NotNull;

public record AcceptMessagesRequest(@NotNull Boolean acceptMessages) {
}
