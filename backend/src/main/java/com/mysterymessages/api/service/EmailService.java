package com.mysterymessages.api.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class EmailService {

    private final WebClient webClient;
    private final String apiKey;
    private final String from;

    public EmailService(
            WebClient.Builder webClientBuilder,
            @Value("${app.resend.api-key}") String apiKey,
            @Value("${app.resend.from}") String from) {
        this.webClient = webClientBuilder.baseUrl("https://api.resend.com").build();
        this.apiKey = apiKey;
        this.from = from;
    }

    public boolean sendVerificationEmail(String to, String username, String verifyCode) {
        if (apiKey == null || apiKey.isBlank()) {
            return true;
        }

        String html = """
                <div style="font-family:Arial,sans-serif">
                  <h2>Mystery Messages Verification</h2>
                  <p>Hello %s,</p>
                  <p>Your verification code is <strong>%s</strong>.</p>
                  <p>This code expires in one hour.</p>
                </div>
                """.formatted(username, verifyCode);

        try {
            webClient.post()
                    .uri("/emails")
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(Map.of(
                            "from", from,
                            "to", new String[] { to },
                            "subject", "Mystery Messages Verification Code",
                            "html", html))
                    .retrieve()
                    .toBodilessEntity()
                    .block();
            return true;
        } catch (RuntimeException ex) {
            return false;
        }
    }
}
