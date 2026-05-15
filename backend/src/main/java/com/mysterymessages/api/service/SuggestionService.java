package com.mysterymessages.api.service;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class SuggestionService {

    private static final List<String> FALLBACK_MESSAGES = List.of(
            "What's one thing you're looking forward to?",
            "If you could have any superpower, what would it be?",
            "What's a simple thing that made you smile recently?");

    private final WebClient webClient;
    private final String apiKey;
    private final String model;

    public SuggestionService(
            WebClient.Builder webClientBuilder,
            @Value("${app.gemini.api-key}") String apiKey,
            @Value("${app.gemini.model}") String model) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com").build();
        this.apiKey = apiKey;
        this.model = model;
    }

    public List<String> suggestMessages() {
        if (apiKey == null || apiKey.isBlank()) {
            return FALLBACK_MESSAGES;
        }

        String prompt = "Create exactly three open-ended friendly questions for an anonymous social messaging platform. "
                + "Separate each question with || and return no extra text.";

        try {
            Object requestBody = Map.of("contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))));

            @SuppressWarnings("unchecked")
            Map<String, Object> response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1beta/models/{model}:generateContent")
                            .queryParam("key", apiKey)
                            .build(model))
                    .bodyValue(Objects.requireNonNull(requestBody))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            String text = extractGeminiText(response);
            return normalizeSuggestions(text);
        } catch (RuntimeException ex) {
            return FALLBACK_MESSAGES;
        }
    }

    @SuppressWarnings("unchecked")
    private String extractGeminiText(Map<String, Object> response) {
        if (response == null) {
            return "";
        }
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            return "";
        }
        Map<String, Object> content = (Map<String, Object>) candidates.getFirst().get("content");
        if (content == null) {
            return "";
        }
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) {
            return "";
        }
        Object text = parts.getFirst().get("text");
        return text == null ? "" : text.toString();
    }

    private List<String> normalizeSuggestions(String text) {
        List<String> messages = List.of(text.split("\\|\\|")).stream()
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .limit(3)
                .toList();

        if (messages.size() == 3) {
            return messages;
        }

        List<String> sentenceSplit = List.of(text.split("[.?!]\\s*")).stream()
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .limit(3)
                .toList();

        return sentenceSplit.size() == 3 ? sentenceSplit : FALLBACK_MESSAGES;
    }
}
