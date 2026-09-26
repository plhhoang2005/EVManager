package com.evmanager.users.controller;

import com.evmanager.users.dto.UserRegistrationRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        // In a real application, we would call a service here to process the registration.
        // For testing validation, we just return a success message.
        return ResponseEntity.ok(Map.of("message", "User registered successfully", "username", request.getUsername()));
    }
}
