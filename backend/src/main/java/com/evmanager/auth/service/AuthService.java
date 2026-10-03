package com.evmanager.auth.service;

import com.evmanager.auth.dto.LoginRequest;
import com.evmanager.auth.jwt.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final com.evmanager.users.repository.UserRepository userRepository;
    private final com.evmanager.users.repository.RoleRepository roleRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final java.util.concurrent.ConcurrentHashMap<String, Integer> failedAttempts = new java.util.concurrent.ConcurrentHashMap<>();
    private static final int MAX_FAILED_ATTEMPTS = 5;

    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
                       com.evmanager.users.repository.UserRepository userRepository,
                       com.evmanager.users.repository.RoleRepository roleRepository,
                       org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String login(LoginRequest loginRequest) {
        String identifier = loginRequest.getUsernameOrEmail().trim().toLowerCase();
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            identifier,
                            loginRequest.getPassword()
                    )
            );

            failedAttempts.remove(identifier);

            SecurityContextHolder.getContext().setAuthentication(authentication);
            return jwtTokenProvider.generateToken(authentication);
        } catch (org.springframework.security.authentication.BadCredentialsException ex) {
            int attempts = failedAttempts.getOrDefault(identifier, 0) + 1;
            failedAttempts.put(identifier, attempts);
            
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase(identifier, identifier)
                    .ifPresent(user -> {
                        user.setStatus("LOCKED");
                        userRepository.save(user);
                    });
            }
            throw ex;
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public void register(com.evmanager.users.dto.UserRegistrationRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.findByUsernameIgnoreCase(username).isPresent()) {
            throw new com.evmanager.exception.ResourceConflictException("Username already exists");
        }
        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new com.evmanager.exception.ResourceConflictException("Email already exists");
        }

        com.evmanager.users.model.Role role = roleRepository.findByRoleName("ROLE_CUSTOMER")
                .orElseGet(() -> roleRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No roles found in database")));

        com.evmanager.users.model.User user = new com.evmanager.users.model.User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            user.setPhone(request.getPhone().trim());
        }
        user.setRole(role);
        user.setStatus("ACTIVE");

        userRepository.save(user);
    }
}
