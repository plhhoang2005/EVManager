package com.evmanager.auth;

import com.evmanager.auth.dto.LoginRequest;
import com.evmanager.auth.jwt.JwtTokenProvider;
import com.evmanager.auth.service.AuthService;
import com.evmanager.auth.service.CustomUserDetailsService;
import com.evmanager.users.model.Role;
import com.evmanager.users.model.User;
import com.evmanager.users.repository.RoleRepository;
import com.evmanager.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LoginNormalizationRegressionTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    private User activeUser;

    @BeforeEach
    void setUp() {
        Role role = new Role();
        role.setRoleName("SALES");

        activeUser = new User();
        activeUser.setUserId(1L);
        activeUser.setUsername("sales_consultant");
        activeUser.setEmail("sales.consultant@evmanager.vn");
        activeUser.setPasswordHash("$2a$10$hashedpassword");
        activeUser.setFullName("Lê Thị Hương");
        activeUser.setStatus("ACTIVE");
        activeUser.setRole(role);
    }

    @Test
    @DisplayName("U01: Username lowercase succeeds")
    void testLogin_UsernameLowercase_Success() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("sales_consultant");
        req.setPassword("Password123!");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        String token = authService.login(req);
        assertNotNull(token);
        assertEquals("mock.jwt.token", token);

        verify(authenticationManager).authenticate(argThat(tokenAuth -> 
            tokenAuth.getPrincipal().equals("sales_consultant") && tokenAuth.getCredentials().equals("Password123!")
        ));
    }

    @Test
    @DisplayName("U02: Username uppercase is normalized and matches correct user")
    void testLogin_UsernameUppercase_Success() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("SALES_CONSULTANT");
        req.setPassword("Password123!");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        String token = authService.login(req);
        assertNotNull(token);

        // Verify identifier passed to authenticationManager was lowercased to sales_consultant
        verify(authenticationManager).authenticate(argThat(tokenAuth -> 
            tokenAuth.getPrincipal().equals("sales_consultant")
        ));
    }

    @Test
    @DisplayName("U03: Username mixed case is normalized and succeeds")
    void testLogin_UsernameMixedCase_Success() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("SaLeS_CoNsUlTaNt");
        req.setPassword("Password123!");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        String token = authService.login(req);
        assertNotNull(token);

        verify(authenticationManager).authenticate(argThat(tokenAuth -> 
            tokenAuth.getPrincipal().equals("sales_consultant")
        ));
    }

    @Test
    @DisplayName("U04: Email lowercase succeeds")
    void testLogin_EmailLowercase_Success() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("sales.consultant@evmanager.vn");
        req.setPassword("Password123!");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        String token = authService.login(req);
        assertNotNull(token);

        verify(authenticationManager).authenticate(argThat(tokenAuth -> 
            tokenAuth.getPrincipal().equals("sales.consultant@evmanager.vn")
        ));
    }

    @Test
    @DisplayName("U05: Email with uppercase (QA BUG-01 Admin@gmail.com) is normalized and succeeds")
    void testLogin_EmailUppercase_Success() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("Sales.Consultant@EVManager.VN");
        req.setPassword("Password123!");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        String token = authService.login(req);
        assertNotNull(token);

        // Verify normalized to lowercase
        verify(authenticationManager).authenticate(argThat(tokenAuth -> 
            tokenAuth.getPrincipal().equals("sales.consultant@evmanager.vn")
        ));
    }

    @Test
    @DisplayName("U06: Identifier with leading and trailing spaces is trimmed")
    void testLogin_IdentifierWithSpaces_Trimmed() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("   sales_consultant   ");
        req.setPassword("Password123!");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        String token = authService.login(req);
        assertNotNull(token);

        verify(authenticationManager).authenticate(argThat(tokenAuth -> 
            tokenAuth.getPrincipal().equals("sales_consultant")
        ));
    }

    @Test
    @DisplayName("U07: Non-existent identifier throws BadCredentialsException")
    void testLogin_NonExistentIdentifier_ThrowsBadCredentials() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("ghost_user");
        req.setPassword("Password123!");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(req));
    }

    @Test
    @DisplayName("U08-U09: Password is case-sensitive and must NOT be altered or lowercased")
    void testLogin_PasswordCaseSensitivityPreserved() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("sales_consultant");
        req.setPassword("  Password123!_ExactCase  "); // Space and case in password must be preserved

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        authService.login(req);

        // Password MUST retain exact raw string (not trimmed, not lowercased)
        verify(authenticationManager).authenticate(argThat(tokenAuth -> 
            tokenAuth.getCredentials().equals("  Password123!_ExactCase  ")
        ));
    }

    @Test
    @DisplayName("U10: Null, empty, or whitespace identifier fails safely without NPE")
    void testLogin_NullOrEmptyIdentifier_FailsSafely() {
        LoginRequest nullReq = new LoginRequest();
        nullReq.setUsernameOrEmail(null);
        nullReq.setPassword("Password123!");
        assertThrows(BadCredentialsException.class, () -> authService.login(nullReq));

        LoginRequest emptyReq = new LoginRequest();
        emptyReq.setUsernameOrEmail("");
        emptyReq.setPassword("Password123!");
        assertThrows(BadCredentialsException.class, () -> authService.login(emptyReq));

        LoginRequest spaceReq = new LoginRequest();
        spaceReq.setUsernameOrEmail("     ");
        spaceReq.setPassword("Password123!");
        assertThrows(BadCredentialsException.class, () -> authService.login(spaceReq));
    }

    @Test
    @DisplayName("U13-U14: CustomUserDetailsService loads user case-insensitively with correct authorities")
    void testCustomUserDetailsService_CaseInsensitiveLookup() {
        when(userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase("sales_consultant", "sales_consultant"))
                .thenReturn(Optional.of(activeUser));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("SALES_CONSULTANT");
        assertNotNull(userDetails);
        assertEquals("sales_consultant", userDetails.getUsername());
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SALES")));
    }

    @Test
    @DisplayName("U22: Inactive or Locked user is properly flagged in UserDetails")
    void testCustomUserDetailsService_LockedAndInactiveAccounts() {
        activeUser.setStatus("LOCKED");
        when(userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase("locked_user", "locked_user"))
                .thenReturn(Optional.of(activeUser));

        UserDetails lockedDetails = customUserDetailsService.loadUserByUsername("locked_user");
        assertFalse(lockedDetails.isAccountNonLocked(), "Locked user must have accountNonLocked = false");

        activeUser.setStatus("INACTIVE");
        when(userRepository.findByUsernameIgnoreCaseOrEmailIgnoreCase("inactive_user", "inactive_user"))
                .thenReturn(Optional.of(activeUser));

        UserDetails inactiveDetails = customUserDetailsService.loadUserByUsername("inactive_user");
        assertFalse(inactiveDetails.isEnabled(), "Inactive user must have enabled = false");
    }

    @Test
    @DisplayName("U18: Identifier with tab and newline characters is cleanly trimmed and lowercased")
    void testLogin_IdentifierWithTabsAndNewlines() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("\t\n  SALES_CONSULTANT  \r\n");
        req.setPassword("Password123!");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        authService.login(req);

        verify(authenticationManager).authenticate(argThat(tokenAuth ->
            tokenAuth.getPrincipal().equals("sales_consultant")
        ));
    }

    @Test
    @DisplayName("U19: Locale.ROOT ensures uppercase ASCII 'I' converts to standard lowercase 'i'")
    void testLogin_LocaleRootSafety() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("ADMIN_VIP");
        req.setPassword("Password123!");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        authService.login(req);

        verify(authenticationManager).authenticate(argThat(tokenAuth ->
            tokenAuth.getPrincipal().equals("admin_vip")
        ));
    }

    @Test
    @DisplayName("U20: Username with dots, hyphens, and underscores is safely lowercased")
    void testLogin_UsernameWithSpecialCharacters() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("Sales.Rep_01-HN");
        req.setPassword("Password123!");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        authService.login(req);

        verify(authenticationManager).authenticate(argThat(tokenAuth ->
            tokenAuth.getPrincipal().equals("sales.rep_01-hn")
        ));
    }

    @Test
    @DisplayName("U23: Complex unicode password with emojis and spaces is passed without alteration")
    void testLogin_PasswordWithUnicodeAndEmojis_Preserved() {
        String complexPass = " 🔑P@ssw0rd! 2026 👰🤵 ";
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("sales_consultant");
        req.setPassword(complexPass);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("mock.jwt.token");

        authService.login(req);

        verify(authenticationManager).authenticate(argThat(tokenAuth ->
            tokenAuth.getCredentials().equals(complexPass)
        ));
    }
}
