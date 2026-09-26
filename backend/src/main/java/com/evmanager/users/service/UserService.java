package com.evmanager.users.service;

import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.users.dto.ChangePasswordRequest;
import com.evmanager.users.dto.UserCreateRequest;
import com.evmanager.users.dto.UserResponse;
import com.evmanager.users.model.Role;
import com.evmanager.users.model.User;
import com.evmanager.users.repository.RoleRepository;
import com.evmanager.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<UserResponse> getUsers(Pageable pageable, String roleName) {
        Page<User> usersPage;
        if (roleName != null && !roleName.isBlank()) {
            usersPage = userRepository.findByRoleName(roleName, pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }
        return usersPage.map(this::mapToResponse);
    }

    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ResourceConflictException("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResourceConflictException("Email already exists");
        }

        Role role = roleRepository.findByRoleName(request.getRoleName())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRoleName()));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(role);
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Transactional
    public void updateStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Basic validation for status
        if (!status.equals("ACTIVE") && !status.equals("INACTIVE") && !status.equals("LOCKED")) {
            throw new IllegalArgumentException("Invalid status value");
        }
        
        user.setStatus(status);
        userRepository.save(user);
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect current password");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("New password cannot be the same as current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setRoleName(user.getRole().getRoleName());
        response.setStatus(user.getStatus());
        response.setLastLoginAt(user.getLastLoginAt());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
