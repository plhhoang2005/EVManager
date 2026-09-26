package com.evmanager.users.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserCreateRequest {

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,}$", 
             message = "Password must contain at least one letter and one number")
    private String password;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email format is not valid")
    private String email;
    
    @NotBlank(message = "Full name cannot be blank")
    private String fullName;

    private String phone;

    @NotBlank(message = "Role name cannot be blank")
    private String roleName;
}
