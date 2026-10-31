# AI Chat Concierge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a floating interactive AI Chat Concierge widget across EVManager's frontend, backed by a Spring Boot conversational endpoint (`POST /api/v1/ai/chat`) using Google Gemini to provide 24/7 automated event consultation and lead generation.

**Architecture:** A multi-turn conversational endpoint in Spring Boot that passes customer context to Gemini 1.5 Flash with an event concierge persona, consumed by a lightweight, responsive floating chatbox widget (`ai-chat.js` and `ai-chat.css`) embedded on the web interface.

**Tech Stack:** Java 21, Spring Boot 3.3.4, Spring Security, RestClient, Google Gemini 1.5 Flash, HTML5/CSS3/Vanilla JavaScript.

**Spec:** AI Event Concierge specification modeled after EventGenie's conversational concierge and EVManager's service domain.

## Global Constraints

- Java version: Java 21 LTS (Spring Boot 3.3.4).
- No database migrations or schema alterations required.
- Maintain public endpoint access under `/api/v1/ai/**` in `SecurityConfig.java`.
- Non-blocking, responsive frontend UI: chat widget must not freeze the main page or obscure critical actions.
- Fallback resilience: If Gemini API fails or runs out of quota, return a friendly helpful customer service response with contact hotline and email guidance.
- Adhere strictly to `AGENTS.md` guidelines (no automated git commits).

## Review Focus

- Empty or blank messages: Validated at DTO layer with `@NotBlank`.
- Long conversational history: Truncated to the last 10 turns to avoid exceeding token limits.
- Mobile responsiveness: Floating chatbox must collapse gracefully on mobile screens without overflowing the viewport.
- XSS prevention: User messages rendered in DOM safely via textContent/sanitized nodes rather than raw innerHTML.
- Graceful offline handling: If backend is stopped, widget shows a clear offline notice rather than silent failure.

---

### Task 1: Chat DTOs & Validation

**Files:**
- Create: `backend/src/main/java/com/evmanager/ai/dto/ChatMessageDto.java`
- Create: `backend/src/main/java/com/evmanager/ai/dto/AiChatRequest.java`
- Create: `backend/src/main/java/com/evmanager/ai/dto/AiChatResponse.java`
- Test: `backend/src/test/java/com/evmanager/ai/dto/AiChatDtoTest.java`

**Interfaces:**
- Produces:
  - `ChatMessageDto(String role, String content)`
  - `AiChatRequest(String message, List<ChatMessageDto> history)`
  - `AiChatResponse(String reply, List<String> quickSuggestions)`

- [ ] **Step 1: Write test verifying validation rules for chat DTOs**
```java
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
        assertTrue(validator.validate(req).isEmpty());
        assertEquals("Tư vấn gói tiệc cưới", req.getMessage());
    }

    @Test
    void testBlankMessageFails() {
        AiChatRequest req = new AiChatRequest("", List.of());
        assertFalse(validator.validate(req).isEmpty());
    }
}
```

- [ ] **Step 2: Run test to verify it fails**
Run: `.\mvnw.cmd test -Dtest=AiChatDtoTest` in `backend/`
Expected: FAIL with missing classes.

- [ ] **Step 3: Implement `ChatMessageDto.java`, `AiChatRequest.java`, and `AiChatResponse.java`**
Add Jakarta validation (`@NotBlank`) and constructors/accessors.

- [ ] **Step 4: Run test to verify it passes**
Run: `.\mvnw.cmd test -Dtest=AiChatDtoTest`
Expected: PASS

---

### Task 2: Service Layer Conversational Method

**Files:**
- Modify: `backend/src/main/java/com/evmanager/ai/service/AiPlanningService.java`
- Test: `backend/src/test/java/com/evmanager/ai/service/AiPlanningServiceTest.java`

**Interfaces:**
- Consumes: `GeminiConfig`, `AiChatRequest`
- Produces: `AiPlanningService.chatWithConcierge(AiChatRequest request) -> AiChatResponse`

- [ ] **Step 1: Write test for `chatWithConcierge` with fallback and valid query**
Add test verifying that `chatWithConcierge` returns a helpful reply even when the API key is not configured.

- [ ] **Step 2: Run test to verify it fails**
Run: `.\mvnw.cmd test -Dtest=AiPlanningServiceTest`
Expected: FAIL with "method chatWithConcierge not found".

- [ ] **Step 3: Implement `chatWithConcierge` in `AiPlanningService.java`**
Implement concierge persona prompt containing LV34 Events information (wedding packages, gala, pricing, customer services) and Gemini multi-turn conversation construction. Add resilient fallback when Gemini is unreachable.

- [ ] **Step 4: Run test to verify it passes**
Run: `.\mvnw.cmd test -Dtest=AiPlanningServiceTest`
Expected: PASS

---

### Task 3: Chat Controller Endpoint

**Files:**
- Modify: `backend/src/main/java/com/evmanager/ai/controller/AiPlanningController.java`
- Test: `backend/src/test/java/com/evmanager/ai/controller/AiPlanningControllerTest.java`

**Interfaces:**
- Produces: `POST /api/v1/ai/chat` returning `ResponseEntity<AiChatResponse>`

- [ ] **Step 1: Write controller test for `POST /api/v1/ai/chat`**
Test successful 200 response and 400 Bad Request on blank message.

- [ ] **Step 2: Run test to verify it fails**
Run: `.\mvnw.cmd test -Dtest=AiPlanningControllerTest`
Expected: FAIL with 404 or endpoint not found.

- [ ] **Step 3: Implement `@PostMapping("/chat")` in `AiPlanningController.java`**
Annotate with `@Valid @RequestBody AiChatRequest request` and delegate to `aiPlanningService.chatWithConcierge(request)`.

- [ ] **Step 4: Run test to verify it passes**
Run: `.\mvnw.cmd test -Dtest=AiPlanningControllerTest`
Expected: PASS

---

### Task 4: Frontend Floating Chat Widget (CSS & JS)

**Files:**
- Create: `frontend/css/ai-chat.css`
- Create: `frontend/js/ai-chat.js`

**Interfaces:**
- Produces: Reusable floating chat bubble `#aiChatBubble` and modal `#aiChatWindow` with live API communication, typing indicators, quick suggestion pills, and conversation history.

- [ ] **Step 1: Create `frontend/css/ai-chat.css`**
Style floating circular bubble with gradient and pulse animation, chat window with header, message list with auto-scroll, suggestion pills, and input area.

- [ ] **Step 2: Create `frontend/js/ai-chat.js`**
Implement toggle open/close, message rendering (user & AI), typing dots animation, API call to `/api/v1/ai/chat` with session memory history, and quick-reply click handlers.

---

### Task 5: Embed Widget into Web Pages

**Files:**
- Modify: `frontend/index.html`
- Modify: `frontend/calculator.html`

**Interfaces:**
- Connects `ai-chat.css` and `ai-chat.js` into public entry pages so the chat assistant is available site-wide.

- [ ] **Step 1: Link `css/ai-chat.css` and `js/ai-chat.js` into `frontend/index.html`**
- [ ] **Step 2: Link `css/ai-chat.css` and `js/ai-chat.js` into `frontend/calculator.html`**

---

### Task 6: Full Verification & Test Pass

**Files:**
- Entire repository

- [ ] **Step 1: Run full Maven test suite**
Run: `.\mvnw.cmd test` in `backend/`
Expected: `BUILD SUCCESS` with 100% tests passing.

- [ ] **Step 2: Check git status to ensure compliance with `AGENTS.md`**
Verify no sensitive keys leaked, no migrations modified.
