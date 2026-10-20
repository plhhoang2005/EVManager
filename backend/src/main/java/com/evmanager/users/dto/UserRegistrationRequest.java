package com.evmanager.users.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Thông tin đăng ký tài khoản người dùng mới")
public class UserRegistrationRequest {

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username can only contain letters and numbers (no spaces or special characters)")
    @Schema(description = "Tên đăng nhập (chỉ chữ và số, không khoảng trắng)", example = "sales01", requiredMode = Schema.RequiredMode.REQUIRED)
    private String username;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\W]{8,}$", 
             message = "Password must contain at least one uppercase letter, one lowercase letter, and one number")
    @Schema(description = "Mật khẩu (tối thiểu 8 ký tự, chứa chữ hoa, chữ thường và số)", example = "Password@123", requiredMode = Schema.RequiredMode.REQUIRED)
    private String password;

    @NotBlank(message = "Confirm password cannot be blank")
    @Schema(description = "Xác nhận lại mật khẩu", example = "Password@123", requiredMode = Schema.RequiredMode.REQUIRED)
    private String confirmPassword;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email format is not valid")
    @Schema(description = "Địa chỉ email liên hệ", example = "sales01@evmanager.com", requiredMode = Schema.RequiredMode.REQUIRED)
    private String email;
    
    @NotBlank(message = "Full name cannot be blank")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Pattern(regexp = "^(?!\\s*$).+", message = "Full name cannot be only whitespace")
    @Schema(description = "Họ và tên đầy đủ", example = "Nguyễn Văn A", requiredMode = Schema.RequiredMode.REQUIRED)
    private String fullName;

    @Pattern(regexp = "^(0|\\+84)[0-9]{9}$", message = "Invalid phone number format")
    @Schema(description = "Số điện thoại di động (10 chữ số)", example = "0901234567")
    private String phone;
}
