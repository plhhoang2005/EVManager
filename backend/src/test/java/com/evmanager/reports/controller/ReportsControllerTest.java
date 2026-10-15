package com.evmanager.reports.controller;

import com.evmanager.audit.repository.AuditLogRepository;
import com.evmanager.auth.repository.OtpTokenRepository;
import com.evmanager.auth.service.EmailService;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.dishes.repository.DishRepository;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.menus.repository.MenuRepository;
import com.evmanager.reports.dto.VenueOccupancyItemDto;
import com.evmanager.reports.dto.VenueOccupancyReportResponse;
import com.evmanager.reports.service.ReportService;
import com.evmanager.services.repository.ServiceRepository;
import com.evmanager.users.repository.RoleRepository;
import com.evmanager.users.repository.UserRepository;
import com.evmanager.venues.repository.VenueRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ReportsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReportService reportService;

    // Required mock beans for active profile test without database
    @MockBean
    private UserRepository userRepository;

    @MockBean
    private RoleRepository roleRepository;

    @MockBean
    private AuditLogRepository auditLogRepository;

    @MockBean
    private CustomerRepository customerRepository;

    @MockBean
    private VenueRepository venueRepository;

    @MockBean
    private EventRepository eventRepository;

    @MockBean
    private OtpTokenRepository otpTokenRepository;

    @MockBean
    private ContractRepository contractRepository;

    @MockBean
    private ServiceRepository serviceRepository;

    @MockBean
    private MenuRepository menuRepository;

    @MockBean
    private DishRepository dishRepository;

    @MockBean
    private EmailService emailService;

    private VenueOccupancyReportResponse createMockResponse() {
        VenueOccupancyItemDto item = VenueOccupancyItemDto.builder()
                .rank(1)
                .venueId(1L)
                .venueName("Sảnh Kim Cương")
                .capacity(500)
                .status("AVAILABLE")
                .rentalPrice(new BigDecimal("20000000.00"))
                .actualEvents(15L)
                .availableShifts(62L)
                .occupancyRate(new BigDecimal("24.19"))
                .totalRevenue(new BigDecimal("300000000.00"))
                .build();

        return VenueOccupancyReportResponse.builder()
                .startDate(LocalDate.of(2026, 10, 1))
                .endDate(LocalDate.of(2026, 10, 31))
                .totalDays(31L)
                .totalVenues(1)
                .totalEvents(15L)
                .totalRevenue(new BigDecimal("300000000.00"))
                .averageOccupancyRate(new BigDecimal("24.19"))
                .items(List.of(item))
                .build();
    }

    @Test
    @DisplayName("BE-23 API: ROLE_ADMIN truy cập hợp lệ -> HTTP 200 OK và JSON đúng schema")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testGetVenueOccupancy_Success_Admin() throws Exception {
        when(reportService.getVenueOccupancyReport(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(createMockResponse());

        mockMvc.perform(get("/api/reports/venue-occupancy")
                        .param("startDate", "2026-10-01")
                        .param("endDate", "2026-10-31")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.startDate").value("2026-10-01"))
                .andExpect(jsonPath("$.endDate").value("2026-10-31"))
                .andExpect(jsonPath("$.totalDays").value(31))
                .andExpect(jsonPath("$.totalVenues").value(1))
                .andExpect(jsonPath("$.totalEvents").value(15))
                .andExpect(jsonPath("$.totalRevenue").value(300000000.00))
                .andExpect(jsonPath("$.averageOccupancyRate").value(24.19))
                .andExpect(jsonPath("$.items[0].rank").value(1))
                .andExpect(jsonPath("$.items[0].venueId").value(1))
                .andExpect(jsonPath("$.items[0].venueName").value("Sảnh Kim Cương"))
                .andExpect(jsonPath("$.items[0].actualEvents").value(15))
                .andExpect(jsonPath("$.items[0].availableShifts").value(62))
                .andExpect(jsonPath("$.items[0].occupancyRate").value(24.19))
                .andExpect(jsonPath("$.items[0].totalRevenue").value(300000000.00));
    }

    @Test
    @DisplayName("BE-23 API: Chưa xác thực (Unauthenticated) -> HTTP 401 Unauthorized")
    void testGetVenueOccupancy_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/reports/venue-occupancy")
                        .param("startDate", "2026-10-01")
                        .param("endDate", "2026-10-31"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("BE-23 API: ROLE_CUSTOMER truy cập -> HTTP 403 Forbidden")
    @WithMockUser(username = "customer", roles = {"CUSTOMER"})
    void testGetVenueOccupancy_Forbidden_Customer() throws Exception {
        mockMvc.perform(get("/api/reports/venue-occupancy")
                        .param("startDate", "2026-10-01")
                        .param("endDate", "2026-10-31"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("BE-23 API: ROLE_SALES truy cập -> HTTP 403 Forbidden")
    @WithMockUser(username = "sales", roles = {"SALES"})
    void testGetVenueOccupancy_Forbidden_Sales() throws Exception {
        mockMvc.perform(get("/api/reports/venue-occupancy")
                        .param("startDate", "2026-10-01")
                        .param("endDate", "2026-10-31"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("BE-23 API: ROLE_COORDINATOR truy cập -> HTTP 403 Forbidden")
    @WithMockUser(username = "coordinator", roles = {"COORDINATOR"})
    void testGetVenueOccupancy_Forbidden_Coordinator() throws Exception {
        mockMvc.perform(get("/api/reports/venue-occupancy")
                        .param("startDate", "2026-10-01")
                        .param("endDate", "2026-10-31"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("BE-23 API: Thiếu tham số startDate -> HTTP 400 Bad Request")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testGetVenueOccupancy_MissingStartDate() throws Exception {
        mockMvc.perform(get("/api/reports/venue-occupancy")
                        .param("endDate", "2026-10-31"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Required parameter is missing: startDate"));
    }

    @Test
    @DisplayName("BE-23 API: Thiếu tham số endDate -> HTTP 400 Bad Request")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testGetVenueOccupancy_MissingEndDate() throws Exception {
        mockMvc.perform(get("/api/reports/venue-occupancy")
                        .param("startDate", "2026-10-01"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Required parameter is missing: endDate"));
    }

    @Test
    @DisplayName("BE-23 API: Định dạng ngày không hợp lệ -> HTTP 400 Bad Request")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testGetVenueOccupancy_InvalidDateFormat() throws Exception {
        mockMvc.perform(get("/api/reports/venue-occupancy")
                        .param("startDate", "2026-13-45")
                        .param("endDate", "2026-10-31"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Invalid parameter format: startDate"));
    }

    @Test
    @DisplayName("BE-23 API: startDate > endDate -> HTTP 400 Bad Request")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testGetVenueOccupancy_StartDateAfterEndDate() throws Exception {
        when(reportService.getVenueOccupancyReport(any(LocalDate.class), any(LocalDate.class)))
                .thenThrow(new IllegalArgumentException("startDate cannot be after endDate"));

        mockMvc.perform(get("/api/reports/venue-occupancy")
                        .param("startDate", "2026-10-31")
                        .param("endDate", "2026-10-01"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("startDate cannot be after endDate"));
    }

    @Test
    @DisplayName("BE-23 Benchmark: Latency trung bình của API venue-occupancy < 500ms")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testGetVenueOccupancy_BenchmarkLatency() throws Exception {
        when(reportService.getVenueOccupancyReport(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(createMockResponse());

        // Warmup
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(get("/api/reports/venue-occupancy")
                    .param("startDate", "2026-10-01")
                    .param("endDate", "2026-10-31"));
        }

        int iterations = 20;
        long startTime = System.currentTimeMillis();
        for (int i = 0; i < iterations; i++) {
            mockMvc.perform(get("/api/reports/venue-occupancy")
                            .param("startDate", "2026-10-01")
                            .param("endDate", "2026-10-31"))
                    .andExpect(status().isOk());
        }
        long totalDuration = System.currentTimeMillis() - startTime;
        double avgLatency = (double) totalDuration / iterations;

        System.out.println("BE-23 Benchmark: " + iterations + " calls, total=" + totalDuration + "ms, avg=" + avgLatency + "ms");
        org.junit.jupiter.api.Assertions.assertTrue(avgLatency < 500.0,
                "Average latency must be < 500ms, actual: " + avgLatency + "ms");
    }
}
