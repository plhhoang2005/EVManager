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

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.evmanager.customers.repository.CustomerRepository customerRepository;

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.evmanager.audit.repository.AuditLogRepository auditLogRepository;

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.evmanager.venues.repository.VenueRepository venueRepository;

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.evmanager.events.repository.EventRepository eventRepository;

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.evmanager.dishes.repository.DishRepository dishRepository;

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.evmanager.menus.repository.MenuRepository menuRepository;

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.evmanager.auth.repository.OtpTokenRepository otpTokenRepository;

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.evmanager.contracts.repository.ContractRepository contractRepository;

    @org.springframework.boot.test.mock.mockito.MockBean
    private com.evmanager.services.repository.ServiceRepository serviceRepository;

    @Test
    void contextLoads() {
        // Test if application context loads successfully
    }
}
