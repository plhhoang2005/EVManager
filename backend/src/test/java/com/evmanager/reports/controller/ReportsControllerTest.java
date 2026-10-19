package com.evmanager.reports.controller;

import com.evmanager.audit.repository.AuditLogRepository;
import com.evmanager.auth.repository.OtpTokenRepository;
import com.evmanager.auth.service.EmailService;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.dishes.repository.DishRepository;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.menus.repository.MenuRepository;
import com.evmanager.reports.service.ExcelExportService;
import com.evmanager.services.repository.ServiceRepository;
import com.evmanager.users.repository.RoleRepository;
import com.evmanager.users.repository.UserRepository;
import com.evmanager.venues.repository.VenueRepository;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
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
import org.springframework.test.web.servlet.MvcResult;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
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
    private ExcelExportService excelExportService;

    // Repositories mocked for test profile without database
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

    private byte[] createDummyXlsx() throws Exception {
        try (org.apache.poi.xssf.usermodel.XSSFWorkbook wb = new org.apache.poi.xssf.usermodel.XSSFWorkbook();
             java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {
            Sheet sheet = wb.createSheet("BaoCao_DoanhThu");
            sheet.createRow(0).createCell(0).setCellValue("EVMANAGER");
            wb.write(out);
            return out.toByteArray();
        }
    }

    @Test
    @DisplayName("TC-11: ROLE_ADMIN gọi xuất Excel -> HTTP 200, Content-Type XLSX, Content-Disposition đúng filename")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testExportExcel_Success_Admin() throws Exception {
        byte[] dummyBytes = createDummyXlsx();
        when(excelExportService.exportEventRevenueReport(any(), any())).thenReturn(dummyBytes);

        mockMvc.perform(get("/api/reports/export/excel")
                        .param("startDate", "2026-10-01")
                        .param("endDate", "2026-10-31"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=BaoCao_DoanhThu.xlsx"))
                .andExpect(content().bytes(dummyBytes));
    }

    @Test
    @DisplayName("TC-12: Mở workbook từ bytes nhận được qua HTTP response -> Đọc thành công với Apache POI")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testExportExcel_ResponseBytesReadBack() throws Exception {
        byte[] dummyBytes = createDummyXlsx();
        when(excelExportService.exportEventRevenueReport(any(), any())).thenReturn(dummyBytes);

        MvcResult result = mockMvc.perform(get("/api/reports/export/excel")
                        .param("startDate", "2026-10-01")
                        .param("endDate", "2026-10-31"))
                .andExpect(status().isOk())
                .andReturn();

        byte[] responseBytes = result.getResponse().getContentAsByteArray();
        assertTrue(responseBytes.length > 0);

        try (Workbook wb = WorkbookFactory.create(new ByteArrayInputStream(responseBytes))) {
            assertNotNull(wb.getSheet("BaoCao_DoanhThu"));
        }
    }

    @Test
    @DisplayName("TC-13: Chưa đăng nhập (Unauthenticated) -> HTTP 401 Unauthorized")
    void testExportExcel_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/reports/export/excel")
                        .param("startDate", "2026-10-01")
                        .param("endDate", "2026-10-31"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("TC-14: ROLE_CUSTOMER truy cập -> HTTP 403 Forbidden")
    @WithMockUser(username = "customer", roles = {"CUSTOMER"})
    void testExportExcel_Forbidden_Customer() throws Exception {
        mockMvc.perform(get("/api/reports/export/excel")
                        .param("startDate", "2026-10-01")
                        .param("endDate", "2026-10-31"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-14: ROLE_SALES truy cập -> HTTP 403 Forbidden")
    @WithMockUser(username = "sales", roles = {"SALES"})
    void testExportExcel_Forbidden_Sales() throws Exception {
        mockMvc.perform(get("/api/reports/export/excel")
                        .param("startDate", "2026-10-01")
                        .param("endDate", "2026-10-31"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-14: ROLE_COORDINATOR truy cập -> HTTP 403 Forbidden")
    @WithMockUser(username = "coordinator", roles = {"COORDINATOR"})
    void testExportExcel_Forbidden_Coordinator() throws Exception {
        mockMvc.perform(get("/api/reports/export/excel")
                        .param("startDate", "2026-10-01")
                        .param("endDate", "2026-10-31"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("TC-16: startDate > endDate -> HTTP 400 Bad Request")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testExportExcel_StartDateAfterEndDate() throws Exception {
        when(excelExportService.exportEventRevenueReport(any(), any()))
                .thenThrow(new IllegalArgumentException("startDate cannot be after endDate"));

        mockMvc.perform(get("/api/reports/export/excel")
                        .param("startDate", "2026-10-31")
                        .param("endDate", "2026-10-01"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("startDate cannot be after endDate"));
    }

    @Test
    @DisplayName("TC-18: Định dạng ngày không hợp lệ -> HTTP 400 Bad Request")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testExportExcel_InvalidDateFormat() throws Exception {
        mockMvc.perform(get("/api/reports/export/excel")
                        .param("startDate", "2026-99-99")
                        .param("endDate", "2026-10-31"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Invalid parameter format: startDate"));
    }

    @Test
    @DisplayName("TC-15: Không truyền ngày (startDate & endDate null) -> Vẫn được phép và trả HTTP 200 OK")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testExportExcel_NoDateParams_Allowed() throws Exception {
        byte[] dummyBytes = createDummyXlsx();
        when(excelExportService.exportEventRevenueReport(null, null)).thenReturn(dummyBytes);

        mockMvc.perform(get("/api/reports/export/excel"))
                .andExpect(status().isOk())
                .andExpect(content().bytes(dummyBytes));
    }

    @Test
    @DisplayName("TC-18 Benchmark: Latency trung bình gọi API export Excel < 500ms")
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testExportExcel_BenchmarkLatency() throws Exception {
        byte[] dummyBytes = createDummyXlsx();
        when(excelExportService.exportEventRevenueReport(any(), any())).thenReturn(dummyBytes);

        // Warmup
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(get("/api/reports/export/excel"));
        }

        int iterations = 20;
        long startTime = System.currentTimeMillis();
        for (int i = 0; i < iterations; i++) {
            mockMvc.perform(get("/api/reports/export/excel"))
                    .andExpect(status().isOk());
        }
        long totalDuration = System.currentTimeMillis() - startTime;
        double avgLatency = (double) totalDuration / iterations;

        System.out.println("BE-24 Benchmark: " + iterations + " calls, total=" + totalDuration + "ms, avg=" + avgLatency + "ms");
        assertTrue(avgLatency < 500.0, "Average latency must be < 500ms, actual: " + avgLatency + "ms");
    }
}
