package com.evmanager.ai.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class AiPlanningDtoTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void testValidRequestPasses() {
        AiPlanningRequest req = new AiPlanningRequest("wedding", 50000000.0, 100, "Cần tone màu pastel");
        assertTrue(validator.validate(req).isEmpty(), "Valid request should produce 0 violations");
        assertEquals("wedding", req.getEventType());
        assertEquals(50000000.0, req.getTotalBudget());
        assertEquals(100, req.getGuestCount());
        assertEquals("Cần tone màu pastel", req.getSpecialNotes());
    }

    @Test
    void testInvalidBudgetFails() {
        AiPlanningRequest req = new AiPlanningRequest("wedding", -100.0, 100, "");
        assertFalse(validator.validate(req).isEmpty(), "Negative budget must fail validation");
    }

    @Test
    void testBlankEventTypeFails() {
        AiPlanningRequest req = new AiPlanningRequest("", 50000000.0, 100, "");
        assertFalse(validator.validate(req).isEmpty(), "Blank eventType must fail validation");
    }

    @Test
    void testResponseDtoAccessors() {
        AiPlanningResponse res = new AiPlanningResponse(
                "Kế hoạch tiệc cưới",
                Map.of("Venue", 20000000.0),
                List.of("Gói âm thanh", "Gói hoa tươi"),
                List.of("T-30 ngày ký hợp đồng"),
                List.of("17:00 đón khách")
        );

        assertEquals("Kế hoạch tiệc cưới", res.getSummary());
        assertEquals(1, res.getBudgetBreakdown().size());
        assertEquals(2, res.getRecommendedServices().size());
        assertEquals(1, res.getPreparationMilestones().size());
        assertEquals(1, res.getDayOfTimeline().size());
    }
}
