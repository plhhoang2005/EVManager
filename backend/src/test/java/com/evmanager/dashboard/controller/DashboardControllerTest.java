package com.evmanager.dashboard.controller;

import com.evmanager.audit.repository.AuditLogRepository;
import com.evmanager.auth.repository.OtpTokenRepository;
import com.evmanager.auth.service.EmailService;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.dashboard.dto.ContractStatusStatsDto;
import com.evmanager.dashboard.dto.DashboardSummaryResponse;
import com.evmanager.dashboard.dto.MonthlyRevenueDto;
import com.evmanager.dashboard.dto.RecentEventDto;
import com.evmanager.dashboard.service.DashboardService;
import com.evmanager.dishes.repository.DishRepository;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.menus.repository.MenuRepository;
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
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    // Standard application-test context repository mocks
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

    private DashboardSummaryResponse buildSampleResponse() {
        List<BigDecimal> monthlyRev = new ArrayList<>();
        List<MonthlyRevenueDto> monthlyDetails = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            monthlyRev.add(BigDecimal.valueOf(i * 10000000L));
            monthlyDetails.add(new MonthlyRevenueDto(i, 2026, BigDecimal.valueOf(i * 10000000L)));
        }

        ContractStatusStatsDto statusStats = ContractStatusStatsDto.builder()
                .daCoc(5L)
                .dangTiec(2L)
                .daThanhLy(8L)
                .daHuy(1L)
                .build();

        RecentEventDto re = RecentEventDto.builder()
                .id(101L)
                .title("Tiệc cưới Hoàng Gia")
                .client("Nguyễn Văn A")
                .type("Tiệc cưới / Sự kiện")
                .date(OffsetDateTime.now())
                .location("Sảnh Kim Cương")
                .budget(new BigDecimal("150000000.00"))
                .status("Đã xác nhận")
                .build();

        return DashboardSummaryResponse.builder()
                .totalRevenue(new BigDecimal("120000000.00"))
                .growthRate(new BigDecimal("20.00"))
                .totalEvents(15L)
                .totalCustomers(30L)
                .pendingContracts(4L)
                .monthlyRevenue(monthlyRev)
                .monthlyDetails(monthlyDetails)
                .contractsByStatus(statusStats)
                .recentEvents(List.of(re))
                .build();
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("DASH-01: Endpoint chính /api/dashboard/stats trả về HTTP 200 và JSON hợp lệ khi có quyền ADMIN")
    void testGetDashboardStats_WithAdminRole_Success() throws Exception {
        when(dashboardService.getDashboardStats(any(), any())).thenReturn(buildSampleResponse());

        mockMvc.perform(get("/api/dashboard/stats")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRevenue", is(120000000.00)))
                .andExpect(jsonPath("$.growthRate", is(20.00)))
                .andExpect(jsonPath("$.totalEvents", is(15)))
                .andExpect(jsonPath("$.totalCustomers", is(30)))
                .andExpect(jsonPath("$.pendingContracts", is(4)))
                .andExpect(jsonPath("$.monthlyRevenue", hasSize(12)))
                .andExpect(jsonPath("$.contractsByStatus.daCoc", is(5)))
                .andExpect(jsonPath("$.contractsByStatus.dangTiec", is(2)))
                .andExpect(jsonPath("$.contractsByStatus.daThanhLy", is(8)))
                .andExpect(jsonPath("$.contractsByStatus.daHuy", is(1)))
                .andExpect(jsonPath("$.recentEvents", hasSize(1)));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("DASH-17 (Gate C): Dual-mapping /api/v1/dashboard/summary trả về đầy đủ schema cho Frontend dashboard.js")
    void testGetDashboardSummary_FrontendEndpoint_Success() throws Exception {
        when(dashboardService.getDashboardStats(any(), any())).thenReturn(buildSampleResponse());

        mockMvc.perform(get("/api/v1/dashboard/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRevenue", notNullValue()))
                .andExpect(jsonPath("$.totalEvents", notNullValue()))
                .andExpect(jsonPath("$.totalCustomers", notNullValue()))
                .andExpect(jsonPath("$.pendingContracts", notNullValue()))
                .andExpect(jsonPath("$.monthlyRevenue", hasSize(12)))
                .andExpect(jsonPath("$.recentEvents[0].id", is(101)));
    }

    @Test
    @DisplayName("DASH-11: Request không có Authentication Token bị từ chối 401 Unauthorized")
    void testGetDashboardStats_Unauthorized_Returns401() throws Exception {
        mockMvc.perform(get("/api/dashboard/stats")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "customer_user", roles = {"CUSTOMER"})
    @DisplayName("DASH-12-A: Role CUSTOMER bị từ chối truy cập 403 Forbidden")
    void testGetDashboardStats_CustomerRole_Forbidden() throws Exception {
        mockMvc.perform(get("/api/dashboard/stats")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "sales_user", roles = {"SALES"})
    @DisplayName("DASH-12-B: Role SALES bị từ chối truy cập 403 Forbidden theo quyết định B1")
    void testGetDashboardStats_SalesRole_Forbidden() throws Exception {
        mockMvc.perform(get("/api/dashboard/stats")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "coord_user", roles = {"COORDINATOR"})
    @DisplayName("DASH-12-C: Role COORDINATOR bị từ chối truy cập 403 Forbidden theo quyết định B1")
    void testGetDashboardStats_CoordinatorRole_Forbidden() throws Exception {
        mockMvc.perform(get("/api/dashboard/stats")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("DASH-16: Đo lường thời gian phản hồi API toàn trình trong môi trường test < 500ms")
    void testPerformance_LatencyUnder500ms() throws Exception {
        when(dashboardService.getDashboardStats(any(), any())).thenReturn(buildSampleResponse());

        // Warm-up request
        mockMvc.perform(get("/api/dashboard/stats")).andExpect(status().isOk());

        long start = System.currentTimeMillis();
        int iterations = 10;
        for (int i = 0; i < iterations; i++) {
            mockMvc.perform(get("/api/dashboard/stats")).andExpect(status().isOk());
        }
        long duration = System.currentTimeMillis() - start;
        long averageLatency = duration / iterations;

        assertTrue(averageLatency < 500, "Thời gian phản hồi trung bình phải dưới 500ms, thực tế: " + averageLatency + "ms");
    }
}
