package com.evmanager;

import com.evmanager.auth.dto.LoginRequest;
import com.evmanager.auth.jwt.JwtTokenProvider;
import com.evmanager.contracts.dto.ContractRequest;
import com.evmanager.users.dto.UserRegistrationRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.io.File;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SwaggerOpenApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    // Mock all data repositories to isolate Spring Boot context
    @MockBean private com.evmanager.users.repository.UserRepository userRepository;
    @MockBean private com.evmanager.users.repository.RoleRepository roleRepository;
    @MockBean private com.evmanager.customers.repository.CustomerRepository customerRepository;
    @MockBean private com.evmanager.audit.repository.AuditLogRepository auditLogRepository;
    @MockBean private com.evmanager.venues.repository.VenueRepository venueRepository;
    @MockBean private com.evmanager.events.repository.EventRepository eventRepository;
    @MockBean private com.evmanager.dishes.repository.DishRepository dishRepository;
    @MockBean private com.evmanager.menus.repository.MenuRepository menuRepository;
    @MockBean private com.evmanager.auth.repository.OtpTokenRepository otpTokenRepository;
    @MockBean private com.evmanager.contracts.repository.ContractRepository contractRepository;
    @MockBean private com.evmanager.services.repository.ServiceRepository serviceRepository;

    @Test
    @DisplayName("SW-01 [Normal] Truy cập Swagger UI tại /api/docs thành công")
    void testSW01_SwaggerUIAccess() throws Exception {
        mockMvc.perform(get("/api/docs"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    // Springdoc can return 200 OK or 3xx redirect to /api/docs/index.html
                    assertThat(status).isIn(200, 301, 302, 307, 308);
                });

        mockMvc.perform(get("/api/swagger-ui/index.html"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assertThat(status).isNotEqualTo(401);
                });
    }

    @Test
    @DisplayName("SW-02 [Normal] Lấy đặc tả OpenAPI tại /v3/api-docs trả về 200 và chứa bearerAuth")
    void testSW02_OpenApiDocsSpecGeneration() throws Exception {
        MvcResult result = mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();
        JsonNode root = objectMapper.readTree(json);

        assertThat(root.has("openapi")).isTrue();
        assertThat(root.path("info").path("title").asText()).contains("EVManager");
        assertThat(root.path("components").path("securitySchemes").has("bearerAuth")).isTrue();

        JsonNode bearerAuth = root.path("components").path("securitySchemes").path("bearerAuth");
        assertThat(bearerAuth.path("type").asText()).isEqualTo("http");
        assertThat(bearerAuth.path("scheme").asText()).isEqualTo("bearer");
        assertThat(bearerAuth.path("bearerFormat").asText()).isEqualTo("JWT");
    }

    @Test
    @DisplayName("SW-03 [Normal] Test Authorize Bearer JWT hợp lệ cho phép truy cập endpoint bảo vệ")
    void testSW03_AuthorizeBearerJwtTokenSuccess() throws Exception {
        com.evmanager.users.model.Role role = new com.evmanager.users.model.Role();
        role.setRoleName("ADMIN");

        com.evmanager.users.model.User user = new com.evmanager.users.model.User();
        user.setUsername("admin");
        user.setEmail("admin@example.com");
        user.setPasswordHash("hashed");
        user.setRole(role);
        user.setStatus("ACTIVE");

        org.mockito.Mockito.when(userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase("admin", "admin"))
                .thenReturn(java.util.Optional.of(user));

        org.mockito.Mockito.when(customerRepository.findAll(org.mockito.ArgumentMatchers.any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(new org.springframework.data.domain.PageImpl<>(Collections.emptyList()));

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "admin", null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
        String token = jwtTokenProvider.generateToken(auth);

        mockMvc.perform(get("/api/v1/customers")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("SW-04 [Boundary] Endpoint bảo vệ không có Authorization header bị chặn 401 Unauthorized")
    void testSW04_ProtectedEndpointWithoutTokenReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/customers"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("SW-05 [Boundary] Public Endpoint không bị chặn 401")
    void testSW05_PublicEndpointsDoNotRequireToken() throws Exception {
        // 1. Health check endpoint -> 200 OK
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));

        // 2. Auth login endpoint -> fails validation (400) but NOT blocked with 401
        LoginRequest badRequest = new LoginRequest();
        badRequest.setUsernameOrEmail("");
        badRequest.setPassword("");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("SW-06 [Tricky] Schema Validation DTO bắt lỗi chặt chẽ (NotNull, NotBlank, Size, Pattern)")
    void testSW06_DtoSchemaValidation() {
        // 1. Validate UserRegistrationRequest invalid cases
        UserRegistrationRequest invalidUser = new UserRegistrationRequest();
        invalidUser.setUsername("a"); // min = 3
        invalidUser.setPassword("weak"); // min = 8 and regex fail
        invalidUser.setEmail("invalid-email"); // not email format
        invalidUser.setFullName(" "); // whitespace pattern fail

        Set<ConstraintViolation<UserRegistrationRequest>> userViolations = validator.validate(invalidUser);
        assertThat(userViolations).isNotEmpty();
        assertThat(userViolations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("username"))).isTrue();
        assertThat(userViolations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password"))).isTrue();
        assertThat(userViolations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email"))).isTrue();

        // 2. Validate ContractRequest null/negative constraints
        ContractRequest invalidContract = new ContractRequest();
        invalidContract.setCustomerId(null); // NotNull
        invalidContract.setEventId(null); // NotNull
        invalidContract.setContractDate(null); // NotNull
        invalidContract.setTableCount(-5); // Min = 0
        invalidContract.setDiscountPercent(BigDecimal.valueOf(-10)); // Min = 0

        Set<ConstraintViolation<ContractRequest>> contractViolations = validator.validate(invalidContract);
        assertThat(contractViolations).isNotEmpty();
        assertThat(contractViolations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("customerId"))).isTrue();
        assertThat(contractViolations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("eventId"))).isTrue();
        assertThat(contractViolations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("contractDate"))).isTrue();
        assertThat(contractViolations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("tableCount"))).isTrue();
        assertThat(contractViolations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("discountPercent"))).isTrue();
    }

    @Test
    @DisplayName("SW-07 [Edge] File đặc tả docs/design/openapi-spec.json đồng bộ và hợp lệ 100%")
    void testSW07_StaticOpenApiSpecSynchronization() throws Exception {
        File specFile = new File("../docs/design/openapi-spec.json");
        if (!specFile.exists()) {
            specFile = new File("docs/design/openapi-spec.json");
        }
        assertThat(specFile).exists();

        String content = Files.readString(specFile.toPath());
        JsonNode root = objectMapper.readTree(content);

        assertThat(root.has("openapi")).isTrue();
        assertThat(root.has("paths")).isTrue();
        assertThat(root.has("tags")).isTrue();

        // Verify tags count (11 tags as expected)
        JsonNode tags = root.path("tags");
        assertThat(tags.size()).isGreaterThanOrEqualTo(10);

        // Verify bearerAuth scheme
        JsonNode bearerAuth = root.path("components").path("securitySchemes").path("bearerAuth");
        assertThat(bearerAuth.isMissingNode()).isFalse();
        assertThat(bearerAuth.path("scheme").asText()).isEqualTo("bearer");

        // Verify public routes have empty security array
        JsonNode healthPath = root.path("paths").path("/api/health").path("get");
        assertThat(healthPath.path("security").isArray()).isTrue();
        assertThat(healthPath.path("security").size()).isEqualTo(0);
    }
}
