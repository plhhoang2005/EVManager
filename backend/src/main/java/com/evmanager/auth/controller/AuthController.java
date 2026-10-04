package com.evmanager.auth.controller;

import com.evmanager.auth.dto.LoginRequest;
import com.evmanager.auth.dto.LoginResponse;
import com.evmanager.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        String token = authService.login(loginRequest);
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody com.evmanager.users.dto.UserRegistrationRequest request) {
        authService.register(request);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/verify-registration")
    public ResponseEntity<String> verifyRegistration(@Valid @RequestBody com.evmanager.auth.dto.VerifyRegistrationRequest request) {
        authService.verifyRegistration(request.getEmail(), request.getOtpCode());
        return ResponseEntity.ok("Tài khoản đã được xác thực thành công.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody com.evmanager.auth.dto.ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok("Mã OTP đã được gửi đến email của bạn.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody com.evmanager.auth.dto.ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Đổi mật khẩu thành công.");
    }
}
