package com.evmanager.users.dto;

import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class UserResponse {
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String roleName;
    private String status;
    private OffsetDateTime lastLoginAt;
    private OffsetDateTime createdAt;
}
