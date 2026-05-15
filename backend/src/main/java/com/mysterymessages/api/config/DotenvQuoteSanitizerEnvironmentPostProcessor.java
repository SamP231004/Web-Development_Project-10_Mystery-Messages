package com.mysterymessages.api.config;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

public class DotenvQuoteSanitizerEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String[] KEYS = {
            "MONGODB_URI",
            "MONGODB_DATABASE",
            "JWT_SECRET",
            "NEXTAUTH_SECRET",
            "FRONTEND_ORIGIN",
            "RESEND_API_KEY",
            "RESEND_FROM",
            "GEMINI_API_KEY",
            "GEMINI_MODEL"
    };

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Map<String, Object> sanitized = new HashMap<>();

        for (String key : KEYS) {
            String value = environment.getProperty(Objects.requireNonNull(key));
            String unquoted = stripWrappingQuotes(value);
            if (unquoted != null && !unquoted.equals(value)) {
                sanitized.put(key, unquoted);
            }
        }

        if (!sanitized.isEmpty()) {
            environment.getPropertySources()
                    .addFirst(new MapPropertySource("sanitized-dotenv-values", sanitized));
        }
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 20;
    }

    private String stripWrappingQuotes(String value) {
        if (value == null || value.length() < 2) {
            return value;
        }

        boolean doubleQuoted = value.startsWith("\"") && value.endsWith("\"");
        boolean singleQuoted = value.startsWith("'") && value.endsWith("'");
        if (doubleQuoted || singleQuoted) {
            return value.substring(1, value.length() - 1);
        }
        return value;
    }
}
