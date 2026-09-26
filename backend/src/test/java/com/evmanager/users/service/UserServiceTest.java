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

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUsername("testuser");
        user.setPasswordHash("hashed_old_password");
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
