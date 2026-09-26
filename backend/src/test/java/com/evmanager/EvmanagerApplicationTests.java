package com.evmanager;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class EvmanagerApplicationTests {

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.evmanager.users.repository.UserRepository userRepository;
    
    @org.springframework.boot.test.mock.mockito.MockBean
    private com.evmanager.users.repository.RoleRepository roleRepository;

    @Test
    void contextLoads() {
        // Test if application context loads successfully
    }
}
