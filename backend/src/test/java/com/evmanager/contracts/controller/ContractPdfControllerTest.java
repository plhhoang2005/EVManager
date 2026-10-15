package com.evmanager.contracts.controller;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.model.ContractMenuEntity;
import com.evmanager.contracts.model.ContractServiceEntity;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.model.Customer;
import com.evmanager.events.model.Event;
import com.evmanager.menus.model.Menu;
import com.evmanager.services.model.Service;
import com.evmanager.users.model.User;
import com.evmanager.users.repository.UserRepository;
import com.evmanager.venues.model.Venue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ContractPdfControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContractRepository contractRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private com.evmanager.users.repository.RoleRepository roleRepository;

    @MockBean
    private com.evmanager.customers.repository.CustomerRepository customerRepository;

    @MockBean
    private com.evmanager.venues.repository.VenueRepository venueRepository;

    @MockBean
    private com.evmanager.events.repository.EventRepository eventRepository;

    @MockBean
    private com.evmanager.services.repository.ServiceRepository serviceRepository;

    @MockBean
    private com.evmanager.menus.repository.MenuRepository menuRepository;

    @MockBean
    private com.evmanager.dishes.repository.DishRepository dishRepository;

    @MockBean
    private com.evmanager.audit.repository.AuditLogRepository auditLogRepository;

    @MockBean
    private com.evmanager.auth.repository.OtpTokenRepository otpTokenRepository;

    private Contract sampleContract;
    private Customer sampleCustomer;

    @BeforeEach
    void setUp() {
        sampleCustomer = new Customer();
        sampleCustomer.setCustomerId(1L);
        sampleCustomer.setFullName("Lê Minh Tú");
        sampleCustomer.setEmail("minhtu.le@example.com");
        sampleCustomer.setPhone("0912345678");
        sampleCustomer.setAddress("123 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh");

        Venue venue = new Venue();
        venue.setVenueId(1L);
        venue.setVenueName("Sảnh Vàng Hoàng Gia");
        venue.setRentalPrice(new BigDecimal("20000000.00"));

        Event event = new Event();
        event.setEventId(1L);
        event.setEventName("Lễ Vu Quy Minh Tú & Thanh Hằng");
        event.setGuestCount(250);
        event.setStartAt(OffsetDateTime.of(2026, 11, 15, 17, 30, 0, 0, ZoneOffset.ofHours(7)));
        event.setEndAt(OffsetDateTime.of(2026, 11, 15, 21, 30, 0, 0, ZoneOffset.ofHours(7)));
        event.setVenue(venue);

        sampleContract = new Contract();
        sampleContract.setContractId(101L);
        sampleContract.setContractCode("HD-20261115-001");
        sampleContract.setContractDate(LocalDate.of(2026, 10, 1));
        sampleContract.setStatus("CONFIRMED");
        sampleContract.setTableCount(25);
        sampleContract.setReserveTableCount(2);
        sampleContract.setTotalAmount(new BigDecimal("120000000.00"));
        sampleContract.setDepositAmount(new BigDecimal("40000000.00"));
        sampleContract.setCustomer(sampleCustomer);
        sampleContract.setEvent(event);

        Menu menu = new Menu();
        menu.setMenuId(1L);
        menu.setMenuName("Set Menu Bát Bửu");
        ContractMenuEntity cme = new ContractMenuEntity();
        cme.setContract(sampleContract);
        cme.setMenu(menu);
        cme.setQuantity(25);
        cme.setAgreedPrice(new BigDecimal("3500000.00"));
        sampleContract.getContractMenus().add(cme);

        Service service = new Service();
        service.setServiceId(1L);
        service.setServiceName("Gói Rượu Vang và Pháo Kim Tuyến");
        ContractServiceEntity cse = new ContractServiceEntity();
        cse.setContract(sampleContract);
        cse.setService(service);
        cse.setQuantity(1);
        cse.setAgreedUnitPrice(new BigDecimal("12500000.00"));
        sampleContract.getContractServices().add(cse);
    }

    @Test
    @DisplayName("TC-PDF-024: GET /api/v1/contracts/{id}/pdf as ADMIN returns 200 with application/pdf")
    @WithMockUser(username = "admin_user", roles = {"ADMIN"})
    void exportPdf_asAdmin_v1Route_shouldReturn200AndPdf() throws Exception {
        when(contractRepository.findById(101L)).thenReturn(Optional.of(sampleContract));

        mockMvc.perform(get("/api/v1/contracts/101/pdf"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=HopDong_HD-20261115-001.pdf"))
                .andExpect(result -> {
                    byte[] content = result.getResponse().getContentAsByteArray();
                    org.junit.jupiter.api.Assertions.assertTrue(content.length > 1000);
                    org.junit.jupiter.api.Assertions.assertEquals('%', (char) content[0]);
                    org.junit.jupiter.api.Assertions.assertEquals('P', (char) content[1]);
                    org.junit.jupiter.api.Assertions.assertEquals('D', (char) content[2]);
                    org.junit.jupiter.api.Assertions.assertEquals('F', (char) content[3]);
                });
    }

    @Test
    @DisplayName("TC-PDF-024 (legacy route): GET /api/contracts/{id}/pdf as SALES returns 200")
    @WithMockUser(username = "sales_user", roles = {"SALES"})
    void exportPdf_asSales_legacyRoute_shouldReturn200AndPdf() throws Exception {
        when(contractRepository.findById(101L)).thenReturn(Optional.of(sampleContract));

        mockMvc.perform(get("/api/contracts/101/pdf"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=HopDong_HD-20261115-001.pdf"));
    }

    @Test
    @DisplayName("TC-PDF-031: GET without authentication returns 401 Unauthorized")
    void exportPdf_unauthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/v1/contracts/101/pdf"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-PDF-035: GET with unauthorized role (e.g. ROLE_GUEST) returns 403 Forbidden")
    @WithMockUser(username = "guest_user", roles = {"GUEST"})
    void exportPdf_unauthorizedRole_shouldReturn403() throws Exception {
        mockMvc.perform(get("/api/v1/contracts/101/pdf"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-PDF-026: GET non-existing contract ID returns 404 Not Found")
    @WithMockUser(username = "admin_user", roles = {"ADMIN"})
    void exportPdf_contractNotFound_shouldReturn404() throws Exception {
        when(contractRepository.findById(9999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/contracts/9999/pdf"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("TC-PDF-027: GET invalid ID format (non-numeric) returns 400 Bad Request")
    @WithMockUser(username = "admin_user", roles = {"ADMIN"})
    void exportPdf_invalidIdFormat_shouldReturn400() throws Exception {
        mockMvc.perform(get("/api/v1/contracts/not-a-number/pdf"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("TC-PDF-036: GET as Customer Owner returns 200 OK")
    @WithMockUser(username = "customer_minhtu", roles = {"CUSTOMER"})
    void exportPdf_asCustomerOwner_shouldReturn200() throws Exception {
        User user = new User();
        user.setUsername("customer_minhtu");
        user.setEmail("minhtu.le@example.com"); // Matches contract's customer email
        when(userRepository.findByUsernameIgnoreCase("customer_minhtu")).thenReturn(Optional.of(user));
        when(contractRepository.findById(101L)).thenReturn(Optional.of(sampleContract));

        mockMvc.perform(get("/api/v1/contracts/101/pdf"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }

    @Test
    @DisplayName("TC-PDF-037: GET as Customer Non-Owner returns 403 Forbidden (IDOR prevention)")
    @WithMockUser(username = "attacker_customer", roles = {"CUSTOMER"})
    void exportPdf_asCustomerNonOwner_shouldReturn403() throws Exception {
        User user = new User();
        user.setUsername("attacker_customer");
        user.setEmail("attacker@example.com");
        user.setPhone("0988888888");
        when(userRepository.findByUsernameIgnoreCase("attacker_customer")).thenReturn(Optional.of(user));
        when(contractRepository.findById(101L)).thenReturn(Optional.of(sampleContract));

        mockMvc.perform(get("/api/v1/contracts/101/pdf"))
                .andExpect(status().isForbidden());
    }
}
