package com.evmanager.ai.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class AiChatDtoTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void testValidChatRequest() {
        AiChatRequest req = new AiChatRequest("Tư vấn gói tiệc cưới", List.of());
        assertTrue(validator.validate(req).isEmpty(), "Valid chat request must have 0 violations");
        assertEquals("Tư vấn gói tiệc cưới", req.getMessage());
        assertNotNull(req.getHistory());
    }

    @Test
    void testBlankMessageFails() {
        AiChatRequest req = new AiChatRequest("", List.of());
        assertFalse(validator.validate(req).isEmpty(), "Blank message must fail validation");
    }

    @Test
    void testChatMessageDtoAccessors() {
        ChatMessageDto msg = new ChatMessageDto("user", "Hello");
        assertEquals("user", msg.getRole());
        assertEquals("Hello", msg.getContent());
    }

    @Test
    void testAiChatResponseAccessors() {
        AiChatResponse res = new AiChatResponse("Xin chào, tôi là trợ lý EVManager", List.of("Gói cưới", "Gói gala"));
        assertEquals("Xin chào, tôi là trợ lý EVManager", res.getReply());
        assertEquals(2, res.getQuickSuggestions().size());
    }
}
