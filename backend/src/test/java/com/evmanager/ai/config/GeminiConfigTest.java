package com.evmanager.ai.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = GeminiConfig.class)
@ActiveProfiles("test")
public class GeminiConfigTest {

    @Autowired(required = false)
    private GeminiConfig geminiConfig;

    @Test
    void testGeminiConfigBeanExists() {
        assertNotNull(geminiConfig, "GeminiConfig bean should be loaded in application context");
        assertNotNull(geminiConfig.getModel(), "Model should be defined");
        assertEquals("gemini-2.5-flash", geminiConfig.getModel());
    }

    @Test
    void testRestClientExists() {
        assertNotNull(geminiConfig, "GeminiConfig bean should be loaded in application context");
        assertNotNull(geminiConfig.getRestClient(), "RestClient should be configured");
    }
}
