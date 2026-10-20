package com.evmanager.auth.controller;

import com.evmanager.auth.dto.LoginRequest;
import com.evmanager.auth.dto.LoginResponse;
import com.evmanager.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Các API xác thực, đăng ký, đăng nhập và khôi phục mật khẩu")
@SecurityRequirements()
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống", description = "Xác thực tài khoản và trả về JWT Bearer token")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        String token = authService.login(loginRequest);
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản mới", description = "Tạo tài khoản và gửi OTP xác nhận qua email")
    public ResponseEntity<String> register(@Valid @RequestBody com.evmanager.users.dto.UserRegistrationRequest request) {
        authService.register(request);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/verify-registration")
    @Operation(summary = "Xác thực OTP đăng ký", description = "Xác nhận mã OTP để kích hoạt tài khoản")
    public ResponseEntity<String> verifyRegistration(@Valid @RequestBody com.evmanager.auth.dto.VerifyRegistrationRequest request) {
        authService.verifyRegistration(request.getEmail(), request.getOtpCode());
        return ResponseEntity.ok("Tài khoản đã được xác thực thành công.");
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Quên mật khẩu", description = "Gửi yêu cầu cấp lại mật khẩu và mã OTP qua email")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody com.evmanager.auth.dto.ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok("Mã OTP đã được gửi đến email của bạn.");
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Đặt lại mật khẩu", description = "Xác thực mã OTP và cập nhật mật khẩu mới")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody com.evmanager.auth.dto.ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Đổi mật khẩu thành công.");
    }
}
