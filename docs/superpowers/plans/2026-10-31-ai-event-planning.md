# AI Event Planning (Plan A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Google Gemini AI into EVManager to provide an automated Smart Budget Allocator, Service Recommender, and Event Milestones/Timeline Generator on both Backend (Spring Boot 3.3.4) and Frontend (calculator.html).

**Architecture:** A lightweight Spring Boot REST integration using Spring's `RestClient` to call Google Gemini API with a structured prompt and schema, exposing `POST /api/v1/ai/plan-event`, permitted in `SecurityConfig`, and consumed by an interactive AI Planner section on `frontend/calculator.html`.

**Tech Stack:** Java 21, Spring Boot 3.3.4, Spring Security, Spring `RestClient`, Jackson JSON, Google Gemini 1.5 Flash API, HTML5/CSS3/JavaScript.

**Spec:** Plan A architectural specification: Combining EventGenie's Generative AI planning capabilities with EVManager's existing event management models.

## Global Constraints

- Java version: Java 21 LTS (Spring Boot 3.3.4).
- No database schema alteration or destructive Flyway migrations required for this feature.
- Secrets management: `GEMINI_API_KEY` stored exclusively in `backend/.env` and environment variables; never hardcoded or committed to Git.
- Resiliency: If Gemini API is unreachable, invalid, or rate-limited, the backend must return a graceful fallback response with deterministic default event allocations rather than crashing with a 500 error.
- Compliance: Follow repository coding standards defined in `AGENTS.md`.

## Review Focus

- Null or missing `GEMINI_API_KEY`: Handled gracefully by returning a structured fallback estimate or a meaningful 503/400 error message.
- Malformed or negative budgets: Validated at the DTO layer with Jakarta Bean Validation (`@Min`, `@NotBlank`).
- High latency / Gemini timeout: `RestClient` configured with a 15-second read timeout to prevent thread exhaustion.
- Raw JSON markdown fencing from LLM: The parser must cleanly strip markdown backticks (````json ... ````) before deserializing into Java DTOs.
- Public endpoint security: Verify `/api/v1/ai/**` is explicitly allowed in `SecurityConfig.java` without breaking existing JWT authentication filters.

---

### Task 1: Environment & Configuration Setup

**Files:**
- Modify: `backend/src/main/resources/application.yml`
- Create: `backend/src/main/java/com/evmanager/ai/config/GeminiConfig.java`
- Test: `backend/src/test/java/com/evmanager/ai/config/GeminiConfigTest.java`

**Interfaces:**
- Produces: `GeminiConfig` component with `apiKey`, `apiUrl`, `model`, and a pre-configured `RestClient` bean.

- [ ] **Step 1: Write the failing test for `GeminiConfig`**
```java
package com.evmanager.ai.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class GeminiConfigTest {
    @Autowired(required = false)
    private GeminiConfig geminiConfig;

    @Test
    void testGeminiConfigBeanExists() {
        assertNotNull(geminiConfig, "GeminiConfig bean should be loaded in application context");
        assertNotNull(geminiConfig.getModel(), "Model should be defined");
    }
}
```

- [ ] **Step 2: Run test to verify it fails**
Run: `mvn test -Dtest=GeminiConfigTest` in `backend/`
Expected: Compilation failure or FAIL with "GeminiConfig cannot be resolved".

- [ ] **Step 3: Implement `GeminiConfig.java` and update `application.yml`**
Add `gemini.api-key: ${GEMINI_API_KEY:}` and `gemini.model: ${GEMINI_MODEL:gemini-1.5-flash}` into `application.yml`. Create `GeminiConfig.java` with a customized `RestClient` configured with 15s timeout.

- [ ] **Step 4: Run test to verify it passes**
Run: `mvn test -Dtest=GeminiConfigTest`
Expected: PASS

- [ ] **Step 5: Verify no secrets are tracked by Git**
Run: `git status` to ensure `.env` remains untracked.

---

### Task 2: DTOs & Validation Layer

**Files:**
- Create: `backend/src/main/java/com/evmanager/ai/dto/AiPlanningRequest.java`
- Create: `backend/src/main/java/com/evmanager/ai/dto/AiPlanningResponse.java`
- Test: `backend/src/test/java/com/evmanager/ai/dto/AiPlanningDtoTest.java`

**Interfaces:**
- Produces: 
  - `AiPlanningRequest(String eventType, Double totalBudget, Integer guestCount, String specialNotes)`
  - `AiPlanningResponse(String summary, Map<String, Double> budgetBreakdown, List<String> recommendedServices, List<String> preparationMilestones, List<String> dayOfTimeline)`

- [ ] **Step 1: Write test verifying validation rules on `AiPlanningRequest`**
```java
package com.evmanager.ai.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class AiPlanningDtoTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void testValidRequestPasses() {
        AiPlanningRequest req = new AiPlanningRequest("wedding", 50000000.0, 100, "Cần tone màu pastel");
        assertTrue(validator.validate(req).isEmpty());
    }

    @Test
    void testInvalidBudgetFails() {
        AiPlanningRequest req = new AiPlanningRequest("wedding", -100.0, 100, "");
        assertFalse(validator.validate(req).isEmpty());
    }
}
```

- [ ] **Step 2: Run test to verify it fails**
Run: `mvn test -Dtest=AiPlanningDtoTest`
Expected: FAIL with missing classes.

- [ ] **Step 3: Implement `AiPlanningRequest.java` and `AiPlanningResponse.java`**
Add Jakarta validation (`@NotBlank`, `@NotNull`, `@Min`).

- [ ] **Step 4: Run test to verify it passes**
Run: `mvn test -Dtest=AiPlanningDtoTest`
Expected: PASS

---

### Task 3: AI Service Layer & Gemini REST Integration

**Files:**
- Create: `backend/src/main/java/com/evmanager/ai/service/AiPlanningService.java`
- Test: `backend/src/test/java/com/evmanager/ai/service/AiPlanningServiceTest.java`

**Interfaces:**
- Consumes: `GeminiConfig`, `AiPlanningRequest`
- Produces: `AiPlanningService.generatePlan(AiPlanningRequest request) -> AiPlanningResponse`

- [ ] **Step 1: Write unit test with simulated Gemini response and fallback mechanism**
Test `generatePlan` parsing valid JSON and handling Gemini API errors by returning a standard fallback plan.

- [ ] **Step 2: Run test to verify it fails**
Run: `mvn test -Dtest=AiPlanningServiceTest`
Expected: FAIL with "AiPlanningService not found".

- [ ] **Step 3: Implement `AiPlanningService.java`**
Implement prompt engineering directing Gemini to return pure JSON conforming to `AiPlanningResponse`. Implement markdown backtick stripping (`replaceAll("```json|```", "").trim()`) and Jackson `ObjectMapper` deserialization. Implement fallback budget calculator when API key is missing or call fails.

- [ ] **Step 4: Run test to verify it passes**
Run: `mvn test -Dtest=AiPlanningServiceTest`
Expected: PASS

---

### Task 4: AI Controller & Security Authorization

**Files:**
- Create: `backend/src/main/java/com/evmanager/ai/controller/AiPlanningController.java`
- Modify: `backend/src/main/java/com/evmanager/config/SecurityConfig.java:57-65`
- Test: `backend/src/test/java/com/evmanager/ai/controller/AiPlanningControllerTest.java`

**Interfaces:**
- Produces: `POST /api/v1/ai/plan-event` returning `ResponseEntity<AiPlanningResponse>`

- [ ] **Step 1: Write controller test using MockMvc verifying public endpoint access**
```java
@WebMvcTest(AiPlanningController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AiPlanningControllerTest { ... }
```

- [ ] **Step 2: Run test to verify it fails**
Run: `mvn test -Dtest=AiPlanningControllerTest`
Expected: FAIL with "No controller found".

- [ ] **Step 3: Implement `AiPlanningController.java` & update `SecurityConfig.java`**
Add `.requestMatchers("/api/v1/ai/**").permitAll()` in `SecurityConfig.java`. Implement controller with `@Valid @RequestBody AiPlanningRequest request`.

- [ ] **Step 4: Run test to verify it passes**
Run: `mvn test -Dtest=AiPlanningControllerTest`
Expected: PASS

---

### Task 5: Frontend UI Integration in `calculator.html` & `calculator.js`

**Files:**
- Modify: `frontend/calculator.html`
- Modify: `frontend/js/calculator.js`

**Interfaces:**
- Consumes: `POST /api/v1/ai/plan-event`
- Produces: Interactive AI Planning UI card with dynamic budget distribution bars, milestone checklists, and timeline schedule.

- [ ] **Step 1: Add AI Smart Planner UI Container in `calculator.html`**
Add a dedicated AI card with inputs: Target Budget (VNĐ), Special Requirements text, and a prominent button "✨ AI Lập Kế Hoạch & Phân Bổ Ngân Sách".
Add dynamic result containers for:
1. Phân bổ ngân sách (Budget Breakdown chart/progress bars).
2. Checklist mốc chuẩn bị (Milestones: T-30, T-15, T-3).
3. Kịch bản chạy sự kiện (Day-of Timeline).

- [ ] **Step 2: Implement API Fetch & Dynamic DOM Rendering in `calculator.js`**
Write `fetchAiPlan(requestData)` with loading spinner state, error toast handling, and clean DOM injection for the AI response.

- [ ] **Step 3: Verify frontend UI in browser**
Open `frontend/calculator.html` locally and verify responsive layout and error handling when backend is disconnected.

---

### Task 6: End-to-End Build & Static Analysis Verification

**Files:**
- Entire repository

- [ ] **Step 1: Run complete Maven compilation & tests**
Run: `mvn clean test` in `backend/`
Expected: `BUILD SUCCESS` with all existing and new unit tests passing.

- [ ] **Step 2: Review Git Status and diff against `AGENTS.md` guidelines**
Run: `git status`
Verify:
- No sensitive `.env` or API keys committed.
- No existing migrations or database structures modified.
- No regression on existing controllers or services.
