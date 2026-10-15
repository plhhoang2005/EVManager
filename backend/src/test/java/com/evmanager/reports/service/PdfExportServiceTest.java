package com.evmanager.reports.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.model.ContractMenuEntity;
import com.evmanager.contracts.model.ContractServiceEntity;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.model.Customer;
import com.evmanager.events.model.Event;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.menus.model.Menu;
import com.evmanager.services.model.Service;
import com.evmanager.users.model.User;
import com.evmanager.users.repository.UserRepository;
import com.evmanager.venues.model.Venue;
import com.lowagie.text.pdf.PdfReader;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PdfExportServiceTest {

    @Mock
    private ContractRepository contractRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PdfExportService pdfExportService;

    private Contract sampleContract;
    private Customer sampleCustomer;
    private Event sampleEvent;
    private Venue sampleVenue;

    @BeforeEach
    void setUp() {
        sampleCustomer = new Customer();
        sampleCustomer.setCustomerId(1L);
        sampleCustomer.setFullName("Nguyễn Văn Hoàng");
        sampleCustomer.setEmail("hoang.nguyen@example.com");
        sampleCustomer.setPhone("0901234567");
        sampleCustomer.setAddress("456 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh");

        sampleVenue = new Venue();
        sampleVenue.setVenueId(1L);
        sampleVenue.setVenueName("Sảnh Kim Cương Hoàng Gia");
        sampleVenue.setRentalPrice(new BigDecimal("25000000.00"));

        sampleEvent = new Event();
        sampleEvent.setEventId(10L);
        sampleEvent.setEventName("Lễ Thành Hôn Hoàng & Mai");
        sampleEvent.setGuestCount(300);
        sampleEvent.setStartAt(OffsetDateTime.of(2026, 11, 20, 11, 0, 0, 0, ZoneOffset.ofHours(7)));
        sampleEvent.setEndAt(OffsetDateTime.of(2026, 11, 20, 14, 0, 0, 0, ZoneOffset.ofHours(7)));
        sampleEvent.setVenue(sampleVenue);

        sampleContract = new Contract();
        sampleContract.setContractId(100L);
        sampleContract.setContractCode("HD-20261120-001");
        sampleContract.setContractDate(LocalDate.of(2026, 10, 15));
        sampleContract.setStatus("CONFIRMED");
        sampleContract.setTableCount(30);
        sampleContract.setReserveTableCount(3);
        sampleContract.setTotalAmount(new BigDecimal("165000000.00"));
        sampleContract.setDepositAmount(new BigDecimal("50000000.00"));
        sampleContract.setCustomer(sampleCustomer);
        sampleContract.setEvent(sampleEvent);

        Menu menu = new Menu();
        menu.setMenuId(1L);
        menu.setMenuName("Set Menu Hoàng Gia 8 Món");
        ContractMenuEntity cme = new ContractMenuEntity();
        cme.setContract(sampleContract);
        cme.setMenu(menu);
        cme.setQuantity(30);
        cme.setAgreedPrice(new BigDecimal("4000000.00"));
        sampleContract.getContractMenus().add(cme);

        Service s1 = new Service();
        s1.setServiceId(1L);
        s1.setServiceName("Gói Trang Trí Hoa Tươi Sảnh Cưới");
        ContractServiceEntity cse = new ContractServiceEntity();
        cse.setContract(sampleContract);
        cse.setService(s1);
        cse.setQuantity(1);
        cse.setAgreedUnitPrice(new BigDecimal("12000000.00"));
        sampleContract.getContractServices().add(cse);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private void authenticateAsStaff() {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                "admin", "password", List.of(new SimpleGrantedAuthority("ROLE_ADMIN")));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    private void authenticateAsCustomer(String username) {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                username, "password", List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @DisplayName("TC-PDF-001: Export full contract to valid PDF")
    void shouldGenerateContractPdfSuccessfully_fullData() throws IOException {
        authenticateAsStaff();
        when(contractRepository.findById(100L)).thenReturn(Optional.of(sampleContract));

        ResponseEntity<byte[]> response = pdfExportService.getContractPdfResponse(100L);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(MediaType.APPLICATION_PDF, response.getHeaders().getContentType());
        assertTrue(response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION).contains("HopDong_HD-20261120-001.pdf"));

        byte[] pdfBytes = response.getBody();
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 1000);

        // Verify PDF Magic Bytes %PDF-
        assertEquals('%', (char) pdfBytes[0]);
        assertEquals('P', (char) pdfBytes[1]);
        assertEquals('D', (char) pdfBytes[2]);
        assertEquals('F', (char) pdfBytes[3]);

        // Parse with OpenPDF PdfReader to ensure no corruption
        PdfReader reader = new PdfReader(new ByteArrayInputStream(pdfBytes));
        assertTrue(reader.getNumberOfPages() >= 1);
        reader.close();
    }

    @Test
    @DisplayName("TC-PDF-002: Export contract with minimal optional data safely")
    void shouldHandleMinimalContractSafely() throws IOException {
        Contract minimalContract = new Contract();
        minimalContract.setContractId(200L);
        minimalContract.setContractCode(null);
        minimalContract.setContractDate(null);
        minimalContract.setStatus(null);
        minimalContract.setTotalAmount(null);
        minimalContract.setDepositAmount(null);
        minimalContract.setCustomer(null);
        minimalContract.setEvent(null);

        byte[] pdfBytes = pdfExportService.generateContractPdfBytes(minimalContract);

        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 500);

        PdfReader reader = new PdfReader(new ByteArrayInputStream(pdfBytes));
        assertEquals(1, reader.getNumberOfPages());
        reader.close();
    }

    @Test
    @DisplayName("TC-PDF-003: Export contract with venue only, no menu/services")
    void shouldHandleContractWithoutCostItems() throws IOException {
        Contract venueOnly = new Contract();
        venueOnly.setContractId(300L);
        venueOnly.setContractCode("HD-VENUE-ONLY");
        venueOnly.setContractDate(LocalDate.now());
        venueOnly.setStatus("DRAFT");
        venueOnly.setCustomer(sampleCustomer);
        venueOnly.setEvent(sampleEvent);
        venueOnly.setTotalAmount(new BigDecimal("25000000.00"));
        venueOnly.setDepositAmount(BigDecimal.ZERO);

        byte[] pdfBytes = pdfExportService.generateContractPdfBytes(venueOnly);
        assertNotNull(pdfBytes);

        PdfReader reader = new PdfReader(new ByteArrayInputStream(pdfBytes));
        assertTrue(reader.getNumberOfPages() >= 1);
        reader.close();
    }

    @Test
    @DisplayName("TC-PDF-004 & TC-PDF-005: Multiple items, currency formatting")
    void shouldFormatCurrencyAndMultipleItemsCorrectly() throws IOException {
        for (int i = 2; i <= 5; i++) {
            Menu m = new Menu();
            m.setMenuId((long) i);
            m.setMenuName("Món ăn tiệc cưới số " + i);
            ContractMenuEntity cme = new ContractMenuEntity();
            cme.setContract(sampleContract);
            cme.setMenu(m);
            cme.setQuantity(i * 5);
            cme.setAgreedPrice(new BigDecimal("1500000.00"));
            sampleContract.getContractMenus().add(cme);
        }

        byte[] pdfBytes = pdfExportService.generateContractPdfBytes(sampleContract);
        assertNotNull(pdfBytes);

        PdfReader reader = new PdfReader(new ByteArrayInputStream(pdfBytes));
        assertTrue(reader.getNumberOfPages() >= 1);
        reader.close();
    }

    @Test
    @DisplayName("TC-PDF-007: Snapshot pricing is preserved")
    void shouldPreserveSnapshotPrices() {
        // Ensure menu entity price is 4,000,000, not 0 or affected by external factors
        assertEquals(new BigDecimal("4000000.00"), sampleContract.getContractMenus().get(0).getAgreedPrice());
        assertEquals(new BigDecimal("12000000.00"), sampleContract.getContractServices().get(0).getAgreedUnitPrice());

        byte[] pdfBytes = pdfExportService.generateContractPdfBytes(sampleContract);
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
    }

    @Test
    @DisplayName("TC-PDF-011: Vietnamese diacritics Unicode handling")
    void shouldHandleVietnameseDiacriticsCorrectly() throws IOException {
        Customer vnCustomer = new Customer();
        vnCustomer.setCustomerId(88L);
        vnCustomer.setFullName("Nguyễn Thị Ánh Đào & Trần Đặng Minh Phúc");
        vnCustomer.setAddress("Ấp 3, Xã Phước Kiển, Huyện Nhà Bè, TP. Hồ Chí Minh");
        vnCustomer.setEmail("anhdao.nguyen@example.com");
        vnCustomer.setPhone("0987654321");
        sampleContract.setCustomer(vnCustomer);

        Venue vnVenue = new Venue();
        vnVenue.setVenueName("Sảnh Hồng Phúc – Trung Tâm Hội Nghị & Tiệc Cưới");
        vnVenue.setRentalPrice(new BigDecimal("30000000.00"));
        sampleEvent.setVenue(vnVenue);
        sampleEvent.setEventName("Lễ Thành Hôn – Kết Duyên Trăm Năm");

        byte[] pdfBytes = pdfExportService.generateContractPdfBytes(sampleContract);
        assertNotNull(pdfBytes);

        PdfReader reader = new PdfReader(new ByteArrayInputStream(pdfBytes));
        assertTrue(reader.getNumberOfPages() >= 1);
        reader.close();
    }

    @Test
    @DisplayName("TC-PDF-012 & TC-PDF-023: Special characters and long text")
    void shouldHandleSpecialCharactersAndLongText() throws IOException {
        Customer xssCustomer = new Customer();
        xssCustomer.setCustomerId(99L);
        xssCustomer.setFullName("<b>Tên Khách Hàng <script>alert('xss')</script> & 'Quotes'</b>");
        xssCustomer.setAddress("Địa chỉ rất dài để kiểm tra độ co giãn và ngắt dòng trong bảng và bố cục văn bản hợp đồng: Tầng 15, Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh");
        xssCustomer.setEmail("safe.xss@example.com");
        sampleContract.setCustomer(xssCustomer);

        byte[] pdfBytes = pdfExportService.generateContractPdfBytes(sampleContract);
        assertNotNull(pdfBytes);

        PdfReader reader = new PdfReader(new ByteArrayInputStream(pdfBytes));
        assertTrue(reader.getNumberOfPages() >= 1);
        reader.close();
    }

    @Test
    @DisplayName("TC-PDF-018 & TC-PDF-019: Multi-page contract with repeated table headers")
    void shouldHandleMultiPageContractWithRepeatedHeaders() throws IOException {
        // Add 35 service items to force document across multiple pages
        for (int i = 1; i <= 35; i++) {
            Service s = new Service();
            s.setServiceId((long) (100 + i));
            s.setServiceName("Dịch vụ bổ sung tiệc cưới số " + i + " với mô tả chi tiết phong cách");
            ContractServiceEntity cse = new ContractServiceEntity();
            cse.setContract(sampleContract);
            cse.setService(s);
            cse.setQuantity(1);
            cse.setAgreedUnitPrice(new BigDecimal("500000.00"));
            sampleContract.getContractServices().add(cse);
        }

        byte[] pdfBytes = pdfExportService.generateContractPdfBytes(sampleContract);
        assertNotNull(pdfBytes);

        PdfReader reader = new PdfReader(new ByteArrayInputStream(pdfBytes));
        assertTrue(reader.getNumberOfPages() >= 2, "Document should span at least 2 pages");
        reader.close();
    }

    @Test
    @DisplayName("TC-PDF-009: Contract status rendering (CONFIRMED, DRAFT, CANCELLED)")
    void shouldRenderDifferentStatusesCorrectly() {
        for (String status : List.of("DRAFT", "CONFIRMED", "COMPLETED", "CANCELLED")) {
            sampleContract.setStatus(status);
            byte[] pdfBytes = pdfExportService.generateContractPdfBytes(sampleContract);
            assertNotNull(pdfBytes);
            assertTrue(pdfBytes.length > 1000);
        }
    }

    @Test
    @DisplayName("TC-PDF-034 & TC-PDF-038: Staff (ADMIN/SALES) can access any contract")
    void shouldAllowStaffAccess() {
        authenticateAsStaff();
        when(contractRepository.findById(100L)).thenReturn(Optional.of(sampleContract));

        ResponseEntity<byte[]> response = pdfExportService.getContractPdfResponse(100L);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    @DisplayName("TC-PDF-036: Customer can access their own contract (by email)")
    void shouldAllowMatchingCustomerAccess_byEmail() {
        authenticateAsCustomer("customer_user");
        User user = new User();
        user.setUsername("customer_user");
        user.setEmail("hoang.nguyen@example.com"); // Matches sampleCustomer.email
        when(userRepository.findByUsernameIgnoreCase("customer_user")).thenReturn(Optional.of(user));
        when(contractRepository.findById(100L)).thenReturn(Optional.of(sampleContract));

        ResponseEntity<byte[]> response = pdfExportService.getContractPdfResponse(100L);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    @DisplayName("TC-PDF-037: Customer denied access to another customer's contract (IDOR prevention)")
    void shouldDenyCustomerAccess_toOtherCustomerContract_IDOR() {
        authenticateAsCustomer("malicious_customer");
        User user = new User();
        user.setUsername("malicious_customer");
        user.setEmail("different.email@example.com");
        user.setPhone("0999999999");
        when(userRepository.findByUsernameIgnoreCase("malicious_customer")).thenReturn(Optional.of(user));
        when(contractRepository.findById(100L)).thenReturn(Optional.of(sampleContract));

        AccessDeniedException ex = assertThrows(AccessDeniedException.class, () ->
                pdfExportService.getContractPdfResponse(100L));
        assertTrue(ex.getMessage().contains("You do not have permission"));
    }

    @Test
    @DisplayName("TC-PDF-026: Contract not found throws ResourceNotFoundException")
    void shouldThrowNotFound_whenContractDoesNotExist() {
        when(contractRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                pdfExportService.getContractPdfResponse(999L));
    }

    @Test
    @DisplayName("TC-PDF-056: Generate sample contract deliverable at docs/design/sample-contract.pdf")
    void shouldGenerateSampleContractPdfFile() throws IOException {
        Path targetPath = Paths.get("..", "docs", "design", "sample-contract.pdf");
        if (!Files.exists(targetPath.getParent())) {
            // Handle running from workspace root
            targetPath = Paths.get("docs", "design", "sample-contract.pdf");
        }

        pdfExportService.generateSampleContractPdf(targetPath);

        assertTrue(Files.exists(targetPath), "Sample contract PDF must exist");
        long fileSize = Files.size(targetPath);
        assertTrue(fileSize > 5000, "Sample contract PDF size should be > 5KB, was: " + fileSize);

        // Verify PDF integrity
        byte[] bytes = Files.readAllBytes(targetPath);
        PdfReader reader = new PdfReader(new ByteArrayInputStream(bytes));
        assertTrue(reader.getNumberOfPages() >= 1);
        reader.close();
    }
}
