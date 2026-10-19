package com.evmanager.security;

import com.evmanager.audit.repository.AuditLogRepository;
import com.evmanager.auth.dto.LoginRequest;
import com.evmanager.auth.repository.OtpTokenRepository;
import com.evmanager.auth.service.EmailService;
import com.evmanager.config.security.CorsProperties;
import com.evmanager.config.security.RateLimiterProperties;
import com.evmanager.config.security.RateLimiterService;
import com.evmanager.config.security.RateLimitingFilter;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.dishes.repository.DishRepository;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.menus.repository.MenuRepository;
import com.evmanager.services.repository.ServiceRepository;
import com.evmanager.users.repository.RoleRepository;
import com.evmanager.users.repository.UserRepository;
import com.evmanager.venues.repository.VenueRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RateLimitingIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RateLimiterService rateLimiterService;

    @Autowired
    private RateLimiterProperties properties;

    @Autowired
    private CorsProperties corsProperties;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private RoleRepository roleRepository;

    @MockBean
    private AuditLogRepository auditLogRepository;

    @MockBean
    private CustomerRepository customerRepository;

    @MockBean
    private VenueRepository venueRepository;

    @MockBean
    private EventRepository eventRepository;

    @MockBean
    private OtpTokenRepository otpTokenRepository;

    @MockBean
    private ContractRepository contractRepository;

    @MockBean
    private ServiceRepository serviceRepository;

    @MockBean
    private MenuRepository menuRepository;

    @MockBean
    private DishRepository dishRepository;

    @MockBean
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        properties.setEnabled(true);
        properties.setLoginLimitPerMinute(5);
        properties.setDefaultLimitPerMinute(10);
        properties.setTrustForwardedHeaders(false);
        rateLimiterService.reset();
    }

    // ==========================================
    // Nhóm C & J: Rate Limiting on Login & Public Endpoints
    // ==========================================

    @Test
    @DisplayName("C04-C06, J01: Login allows up to 5 attempts, and 6th attempt returns 429 Too Many Requests")
    void testLoginRateLimit_Returns429AfterThreshold() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("user@example.com");
        loginRequest.setPassword("WrongPassword123!");

        when(userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase("user@example.com", "user@example.com"))
                .thenReturn(Optional.empty());

        // First 5 attempts should return 401 Unauthorized (processed by AuthController)
        for (int i = 1; i <= 5; i++) {
            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isUnauthorized());
        }

        // 6th attempt must be intercepted by RateLimitingFilter with HTTP 429
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().string("Retry-After", "60"))
                .andExpect(jsonPath("$.status", is(429)))
                .andExpect(jsonPath("$.error", is("Too Many Requests")))
                .andExpect(jsonPath("$.message", containsString("Quá nhiều yêu cầu")));
    }

    @Test
    @DisplayName("C09: Different IP has independent quota and is not throttled")
    void testRateLimit_DifferentIp_NotThrottled() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("user@example.com");
        loginRequest.setPassword("WrongPassword123!");

        // IP 192.168.1.100 exhausts its 5 attempts
        for (int i = 1; i <= 5; i++) {
            mockMvc.perform(post("/api/v1/auth/login")
                            .with(request -> {
                                request.setRemoteAddr("192.168.1.100");
                                return request;
                            })
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isUnauthorized());
        }

        // 6th attempt from 192.168.1.100 is 429
        mockMvc.perform(post("/api/v1/auth/login")
                        .with(request -> {
                            request.setRemoteAddr("192.168.1.100");
                            return request;
                        })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isTooManyRequests());

        // Meanwhile, IP 192.168.1.200 can still perform request successfully without 429
        mockMvc.perform(post("/api/v1/auth/login")
                        .with(request -> {
                            request.setRemoteAddr("192.168.1.200");
                            return request;
                        })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized()); // NOT 429
    }

    @Test
    @DisplayName("C13: OPTIONS preflight requests do not consume rate limit quota")
    void testPreflight_DoesNotConsumeQuota() throws Exception {
        // Send 10 OPTIONS requests
        for (int i = 0; i < 10; i++) {
            mockMvc.perform(options("/api/v1/auth/login")
                            .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                            .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                    .andExpect(status().isOk());
        }

        // Now perform a normal login request; it should be attempt #1, not blocked!
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("user@example.com");
        loginRequest.setPassword("WrongPassword123!");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized()); // Successfully reached controller
    }

    // ==========================================
    // Nhóm F: HTTP 429 & Error Handling
    // ==========================================

    @Test
    @DisplayName("F10 & F11: 429 response retains security headers and allowed CORS origin")
    void test429Response_RetainsSecurityHeadersAndCors() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("user@example.com");
        loginRequest.setPassword("WrongPassword123!");

        // Exhaust login quota with CORS Origin header
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/v1/auth/login")
                    .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(loginRequest)));
        }

        // 6th request
        mockMvc.perform(post("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000"))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().string("X-Frame-Options", "DENY"))
                .andExpect(header().string("Referrer-Policy", "strict-origin-when-cross-origin"))
                .andExpect(header().string("Retry-After", "60"));
    }

    @Test
    @DisplayName("F12: Request from disallowed origin does not receive Access-Control-Allow-Origin")
    void testDisallowedOrigin_NeverReceivesCorsHeaders() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("user@example.com");
        loginRequest.setPassword("WrongPassword123!");

        mockMvc.perform(post("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, "http://malicious.com")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
    }

    @Test
    @DisplayName("F12b: RateLimitingFilter directly writes 429 and omits CORS header for disallowed origin")
    void testRateLimitingFilter_DirectlyOmitsCorsForDisallowedOrigin() throws Exception {
        RateLimitingFilter filter = new RateLimitingFilter(rateLimiterService, properties, corsProperties, objectMapper);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("192.168.1.50");
        request.setRequestURI("/api/v1/auth/login");
        request.setMethod("POST");
        request.addHeader(HttpHeaders.ORIGIN, "http://disallowed.com");

        MockHttpServletResponse response = new MockHttpServletResponse();

        // Exhaust 5 requests in rateLimiterService
        for (int i = 0; i < 5; i++) {
            rateLimiterService.checkRateLimit("192.168.1.50", "/api/v1/auth/login", "POST");
        }

        // 6th request through filter
        filter.doFilter(request, response, new MockFilterChain());

        assertEquals(429, response.getStatus());
        assertNull(response.getHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
        assertEquals("nosniff", response.getHeader("X-Content-Type-Options"));
        assertEquals("DENY", response.getHeader("X-Frame-Options"));
    }

    // ==========================================
    // Nhóm E: Concurrency & Address Spoofing
    // ==========================================

    @Test
    @DisplayName("E11: Untrusted X-Forwarded-For header cannot spoof IP when trust-forwarded-headers=false")
    void testRateLimit_SpoofedXForwardedFor_Ignored() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("user@example.com");
        loginRequest.setPassword("WrongPassword123!");

        // Attacker attempts to change X-Forwarded-For on each request, but remoteAddr is the same
        for (int i = 1; i <= 5; i++) {
            mockMvc.perform(post("/api/v1/auth/login")
                            .header("X-Forwarded-For", "198.51.100." + i)
                            .with(request -> {
                                request.setRemoteAddr("203.0.113.10");
                                return request;
                            })
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isUnauthorized());
        }

        // The 6th request with a new spoofed X-Forwarded-For must still be blocked because remoteAddr is 203.0.113.10
        mockMvc.perform(post("/api/v1/auth/login")
                        .header("X-Forwarded-For", "198.51.100.99")
                        .with(request -> {
                            request.setRemoteAddr("203.0.113.10");
                            return request;
                        })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    @DisplayName("C03: General API rate limit blocks request after 10 requests")
    void testGeneralRoute_RateLimit_Exceeded() throws Exception {
        // General limit is set to 10
        for (int i = 1; i <= 10; i++) {
            mockMvc.perform(get("/api/v1/events")
                            .with(request -> {
                                request.setRemoteAddr("10.10.10.10");
                                return request;
                            }))
                    .andExpect(status().isUnauthorized()); // 401 under limit
        }

        // 11th request receives 429
        mockMvc.perform(get("/api/v1/events")
                        .with(request -> {
                            request.setRemoteAddr("10.10.10.10");
                            return request;
                        }))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().string("Retry-After", "60"));
    }
}
