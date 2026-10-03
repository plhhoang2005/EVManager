package com.evmanager.users.service;

import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.users.dto.ChangePasswordRequest;
import com.evmanager.users.model.User;
import com.evmanager.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import com.evmanager.exception.ResourceConflictException;
import com.evmanager.users.dto.UserProfileUpdateRequest;
import com.evmanager.users.dto.UserResponse;
import com.evmanager.users.model.Role;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;
    private Role role;

    @BeforeEach
    void setUp() {
        role = new Role();
        role.setRoleId(1L);
        role.setRoleName("ROLE_USER");

        user = new User();
        user.setUserId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setFullName("Test User");
        user.setPhone("0987654321");
        user.setRole(role);
        user.setPasswordHash("hashed_old_password");
    }

    @Test
    void getUserProfile_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        UserResponse response = userService.getUserProfile("testuser");

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("Test User", response.getFullName());
        assertEquals("test@example.com", response.getEmail());
    }

    @Test
    void updateUserProfile_Success() {
        UserProfileUpdateRequest request = new UserProfileUpdateRequest();
        request.setFullName("Updated Name");
        request.setEmail("updated@example.com");
        request.setPhone("0123456789");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(userRepository.findByEmail("updated@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.updateUserProfile("testuser", request);

        assertNotNull(response);
        assertEquals("Updated Name", response.getFullName());
        assertEquals("updated@example.com", response.getEmail());
        assertEquals("0123456789", response.getPhone());
    }

    @Test
    void updateUserProfile_EmailConflict() {
        User otherUser = new User();
        otherUser.setUserId(2L);
        otherUser.setEmail("existing@example.com");

        UserProfileUpdateRequest request = new UserProfileUpdateRequest();
        request.setFullName("Updated Name");
        request.setEmail("existing@example.com");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(otherUser));

        assertThrows(ResourceConflictException.class, () -> userService.updateUserProfile("testuser", request));
    }

    @Test
    void changePassword_Success() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("old_password");
        request.setNewPassword("new_password123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old_password", "hashed_old_password")).thenReturn(true);
        when(passwordEncoder.matches("new_password123", "hashed_old_password")).thenReturn(false);
        when(passwordEncoder.encode("new_password123")).thenReturn("hashed_new_password");

        assertDoesNotThrow(() -> userService.changePassword("testuser", request));

        assertEquals("hashed_new_password", user.getPasswordHash());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void changePassword_UserNotFound() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("old_password");
        request.setNewPassword("new_password123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.changePassword("testuser", request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void changePassword_WrongOldPassword() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("wrong_old_password");
        request.setNewPassword("new_password123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong_old_password", "hashed_old_password")).thenReturn(false);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
                () -> userService.changePassword("testuser", request));
        
        assertEquals("Incorrect current password", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void changePassword_NewPasswordSameAsOld() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("old_password");
        request.setNewPassword("old_password");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old_password", "hashed_old_password")).thenReturn(true);
        // Assuming passwordEncoder.matches returns true if new password matches old hash
        when(passwordEncoder.matches("old_password", "hashed_old_password")).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, 
                () -> userService.changePassword("testuser", request));
        
        assertEquals("New password cannot be the same as current password", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }
}
