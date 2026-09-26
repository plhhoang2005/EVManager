package com.evmanager.controller;

import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test-exception")
public class TestExceptionController {

    @GetMapping("/not-found")
    public void testNotFound() {
        throw new ResourceNotFoundException("Resource not found");
    }

    @GetMapping("/conflict")
    public void testConflict() {
        throw new ResourceConflictException("Resource already exists");
    }

    @GetMapping("/internal")
    public void testInternal() {
        throw new RuntimeException("Unexpected error");
    }

    @PostMapping("/validation")
    public void testValidation(@Valid @RequestBody TestRequest request) {
        // Will throw MethodArgumentNotValidException if invalid
    }

    public static class TestRequest {
        @NotBlank(message = "Name is required")
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
