package com.evmanager.auth;

import com.evmanager.auth.dto.LoginRequest;
import com.evmanager.users.dto.UserRegistrationRequest;
import com.evmanager.users.model.Role;
import com.evmanager.users.model.User;
import com.evmanager.users.repository.RoleRepository;
import com.evmanager.users.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private RoleRepository roleRepository;

    @MockBean
    private com.evmanager.audit.repository.AuditLogRepository auditLogRepository;

    @MockBean
    private com.evmanager.customers.repository.CustomerRepository customerRepository;

    @MockBean
    private com.evmanager.venues.repository.VenueRepository venueRepository;

    @MockBean
    private com.evmanager.events.repository.EventRepository eventRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testRegister_Success() throws Exception {
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setUsername("newuser");
        request.setPassword("Password123!");
        request.setConfirmPassword("Password123!");
        request.setEmail("newuser@example.com");
        request.setFullName("New User");
        request.setPhone("0901234567");

        Role role = new Role();
        role.setRoleName("ROLE_CUSTOMER");
        
        when(userRepository.findByUsernameIgnoreCase(request.getUsername())).thenReturn(Optional.empty());
        when(userRepository.findByEmailIgnoreCase(request.getEmail())).thenReturn(Optional.empty());
        when(roleRepository.findByRoleName("ROLE_CUSTOMER")).thenReturn(Optional.of(role));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().string("User registered successfully"));
    }

    @Test
    void testRegister_ValidationFailures() throws Exception {
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setUsername("us"); // too short
        request.setPassword("weak"); // weak
        request.setConfirmPassword("weak2"); // mismatch
        request.setEmail("invalid-email");
        request.setFullName("");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    @Test
    void testLogin_Success() throws Exception {
        Role role = new Role();
        role.setRoleName("ROLE_CUSTOMER");

        User user = new User();
        user.setUsername("testuser");
        user.setEmail("testuser@example.com");
        user.setPasswordHash(passwordEncoder.encode("Password123!"));
        user.setFullName("Test User");
        user.setRole(role);
        user.setStatus("ACTIVE");

        when(userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase("testuser", "testuser")).thenReturn(Optional.of(user));

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("testuser");
        loginRequest.setPassword("Password123!");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists());
    }

    @Test
    void testLogin_FailedAttemptsLockAccount() throws Exception {
        Role role = new Role();
        role.setRoleName("ROLE_CUSTOMER");

        User user = new User();
        user.setUsername("lockeduser");
        user.setEmail("lockeduser@example.com");
        user.setPasswordHash(passwordEncoder.encode("Password123!"));
        user.setFullName("Locked User");
        user.setRole(role);
        user.setStatus("ACTIVE");

        when(userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase("lockeduser", "lockeduser")).thenReturn(Optional.of(user));
        when(userRepository.findByUsernameIgnoreCase("lockeduser")).thenReturn(Optional.of(user));

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("lockeduser");
        loginRequest.setPassword("WrongPassword!");

        // 5 failed attempts
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(loginRequest)))
                    .andExpect(status().isUnauthorized());
        }

        // The user status should be LOCKED now in memory (since we mocked save)
        // Wait, in my AuthIntegrationTest, the actual object in memory is updated!
        
        loginRequest.setPassword("Password123!");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isForbidden());
    }
}
