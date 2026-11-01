package com.evmanager.ai.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.List;

@Configuration
public class GeminiConfig {

    private static final Logger log = LoggerFactory.getLogger(GeminiConfig.class);

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String model;

    @Value("${gemini.api-url:https://generativelanguage.googleapis.com/v1beta}")
    private String apiUrl;

    private volatile boolean enabled = true;

    @PostConstruct
    public void init() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            loadFromEnvFile();
        }
        if (model == null || model.contains("1.5")) {
            model = "gemini-2.5-flash";
        }
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            log.info("Gemini AI configured successfully with model '{}'", model);
        } else {
            log.warn("Gemini API key is not configured. Fallback deterministic plans will be used.");
        }
    }

    private void loadFromEnvFile() {
        List<Path> candidatePaths = List.of(
                Paths.get(".env"),
                Paths.get("backend/.env"),
                Paths.get("../backend/.env")
        );

        for (Path path : candidatePaths) {
            if (Files.exists(path)) {
                try {
                    List<String> lines = Files.readAllLines(path);
                    for (String line : lines) {
                        line = line.trim();
                        if (line.startsWith("GEMINI_API_KEY=")) {
                            this.apiKey = line.substring("GEMINI_API_KEY=".length()).trim();
                        } else if (line.startsWith("GEMINI_MODEL=")) {
                            this.model = line.substring("GEMINI_MODEL=".length()).trim();
                        }
                    }
                    if (this.apiKey != null && !this.apiKey.isEmpty()) {
                        break;
                    }
                } catch (Exception e) {
                    log.debug("Could not read .env at {}: {}", path, e.getMessage());
                }
            }
        }
    }

    @Bean
    public RestClient geminiRestClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(15));
        factory.setReadTimeout(Duration.ofSeconds(15));

        return RestClient.builder()
                .requestFactory(factory)
                .build();
    }

    public String getApiKey() {
        return apiKey;
    }

    public String getModel() {
        return model;
    }

    public String getApiUrl() {
        return apiUrl;
    }

    public RestClient getRestClient() {
        return geminiRestClient();
    }

    public synchronized void updateConfig(String newApiKey, String newModel, Boolean newEnabled) {
        if (newApiKey != null) {
            this.apiKey = newApiKey.trim();
        }
        if (newModel != null && !newModel.trim().isEmpty()) {
            this.model = newModel.trim();
        }
        if (newEnabled != null) {
            this.enabled = newEnabled;
        }
        log.info("GeminiConfig updated at runtime: model='{}', hasKey={}, enabled={}", this.model, (this.apiKey != null && !this.apiKey.isEmpty()), this.enabled);
    }

    public synchronized void updateConfig(String newApiKey, String newModel) {
        updateConfig(newApiKey, newModel, null);
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getMaskedApiKey() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return "Chưa cấu hình (Đang chạy thuật toán Fallback)";
        }
        if (apiKey.length() <= 8) {
            return "********";
        }
        return apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length() - 4);
    }
}
