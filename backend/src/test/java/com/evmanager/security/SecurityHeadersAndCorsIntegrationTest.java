package com.evmanager.security;

import com.evmanager.audit.repository.AuditLogRepository;
import com.evmanager.auth.repository.OtpTokenRepository;
import com.evmanager.auth.service.EmailService;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.dishes.repository.DishRepository;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.menus.repository.MenuRepository;
import com.evmanager.services.repository.ServiceRepository;
import com.evmanager.users.repository.RoleRepository;
import com.evmanager.users.repository.UserRepository;
import com.evmanager.venues.repository.VenueRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SecurityHeadersAndCorsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

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

    // ==========================================
    // Nhóm A & B: CORS Configuration & Compatibility
    // ==========================================

    @Test
    @DisplayName("A01: Request from allowed origin (http://localhost:3000) receives valid CORS headers")
    void testCors_AllowedOrigin_ReturnsCorsHeaders() throws Exception {
        mockMvc.perform(options("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Content-Type,Authorization"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, containsString("POST")));
    }

    @Test
    @DisplayName("A01b: Request from allowed Vite origin (http://localhost:5173) receives valid CORS headers")
    void testCors_AllowedViteOrigin_ReturnsCorsHeaders() throws Exception {
        mockMvc.perform(options("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true"));
    }

    @Test
    @DisplayName("A02: Request from disallowed origin does not receive Access-Control-Allow-Origin")
    void testCors_DisallowedOrigin_DoesNotReturnAllowOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, "http://malicious-site.com")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
    }

    @Test
    @DisplayName("A03: Wildcard origin is not mirrored for unauthorized origin")
    void testCors_WildcardNotMirrored() throws Exception {
        mockMvc.perform(options("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, "http://attacker.com")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
    }

    @Test
    @DisplayName("A04: Origin null is rejected by default")
    void testCors_NullOrigin_Rejected() throws Exception {
        mockMvc.perform(options("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, "null")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
    }

    @Test
    @DisplayName("A05: Scheme difference (https vs http) is strictly enforced")
    void testCors_SchemeDifference_Rejected() throws Exception {
        // http://localhost:3000 is allowed, but https://localhost:3000 is not explicitly allowed
        mockMvc.perform(options("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, "https://localhost:3000")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
    }

    @Test
    @DisplayName("A06: Port difference (e.g., 8080 vs 3000) is strictly rejected")
    void testCors_PortDifference_Rejected() throws Exception {
        mockMvc.perform(options("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, "http://localhost:8080")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
    }

    @Test
    @DisplayName("A07: Subdomain not in allowlist is strictly rejected")
    void testCors_SubdomainNotAllowed_Rejected() throws Exception {
        mockMvc.perform(options("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, "http://sub.localhost:3000")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
    }

    @Test
    @DisplayName("A10 & A13: Preflight OPTIONS allows Authorization and Content-Type headers")
    void testCors_Preflight_AllowsRequiredHeaders() throws Exception {
        mockMvc.perform(options("/api/v1/events")
                        .header(HttpHeaders.ORIGIN, "http://localhost:3000")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Authorization,Content-Type,Accept"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:3000"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, containsString("Authorization")));
    }

    @Test
    @DisplayName("B02: Disallowed origin does not receive Access-Control-Allow-Credentials")
    void testCors_DisallowedOrigin_DoesNotReceiveCredentials() throws Exception {
        mockMvc.perform(options("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, "http://evil.org")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST"))
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS));
    }

    @Test
    @DisplayName("B07: Non-CORS request without Origin header is handled without CORS headers")
    void testCors_NonCorsRequest_HandledNormally() throws Exception {
        mockMvc.perform(get("/api/v1/auth/login"))
                // GET not supported on login -> 405 Method Not Allowed, but processed normally without CORS failure
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
    }

    // ==========================================
    // Nhóm H: HTTP Security Headers
    // ==========================================

    @Test
    @DisplayName("H01: X-Content-Type-Options: nosniff is present on responses")
    void testHeaders_ContentTypeOptionsNoSniff() throws Exception {
        mockMvc.perform(get("/api/v1/non-existent-endpoint"))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"));
    }

    @Test
    @DisplayName("H02: X-Frame-Options: DENY is present to prevent clickjacking")
    void testHeaders_FrameOptionsDeny() throws Exception {
        mockMvc.perform(get("/api/v1/non-existent-endpoint"))
                .andExpect(header().string("X-Frame-Options", "DENY"));
    }

    @Test
    @DisplayName("H06: Referrer-Policy: strict-origin-when-cross-origin is present")
    void testHeaders_ReferrerPolicy() throws Exception {
        mockMvc.perform(get("/api/v1/non-existent-endpoint"))
                .andExpect(header().string("Referrer-Policy", "strict-origin-when-cross-origin"));
    }

    @Test
    @DisplayName("H07: Content-Security-Policy contains frame-ancestors 'none'")
    void testHeaders_ContentSecurityPolicy() throws Exception {
        mockMvc.perform(get("/api/v1/non-existent-endpoint"))
                .andExpect(header().string("Content-Security-Policy", containsString("frame-ancestors 'none'")));
    }

    @Test
    @DisplayName("H09: X-Powered-By header is suppressed/not exposed")
    void testHeaders_XPoweredBy_Suppressed() throws Exception {
        mockMvc.perform(get("/api/v1/auth/login"))
                .andExpect(header().doesNotExist("X-Powered-By"));
    }

    @Test
    @DisplayName("H10: Server header is suppressed/not exposed")
    void testHeaders_Server_Suppressed() throws Exception {
        mockMvc.perform(get("/api/v1/auth/login"))
                .andExpect(header().doesNotExist("Server"));
    }

    @Test
    @DisplayName("H12: Security headers are present on 401 Unauthorized response")
    void testHeaders_PresentOn401() throws Exception {
        mockMvc.perform(get("/api/v1/events")) // protected route without token -> 401
                .andExpect(status().isUnauthorized())
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().string("X-Frame-Options", "DENY"))
                .andExpect(header().string("Referrer-Policy", "strict-origin-when-cross-origin"));
    }

    @Test
    @DisplayName("H12b: Security headers are present on 404 Not Found response")
    void testHeaders_PresentOn404() throws Exception {
        mockMvc.perform(get("/api/v1/completely-unknown-route"))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().string("X-Frame-Options", "DENY"));
    }
}
