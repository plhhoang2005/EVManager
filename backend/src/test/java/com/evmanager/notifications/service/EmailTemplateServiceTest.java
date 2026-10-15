package com.evmanager.notifications.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.customers.model.Customer;
import com.evmanager.events.model.Event;
import com.evmanager.venues.model.Venue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.*;

class EmailTemplateServiceTest {

    private EmailTemplateService templateService;
    private Contract contract;
    private Customer customer;
    private Event event;
    private Venue venue;

    @BeforeEach
    void setUp() {
        templateService = new EmailTemplateService();

        customer = new Customer();
        customer.setCustomerId(1L);
        customer.setFullName("Nguyễn Văn Hoàng");
        customer.setEmail("hoang.nguyen@example.com");
        customer.setPhone("0901234567");

        venue = new Venue();
        venue.setVenueId(1L);
        venue.setVenueName("Sảnh Kim Cương Hoàng Gia");

        event = new Event();
        event.setEventId(10L);
        event.setEventName("Lễ Thành Hôn Hoàng & Mai");
        event.setStartAt(OffsetDateTime.of(2026, 11, 20, 11, 0, 0, 0, ZoneOffset.ofHours(7)));
        event.setVenue(venue);

        contract = new Contract();
        contract.setContractId(100L);
        contract.setContractCode("HD-20261120-001");
        contract.setContractDate(LocalDate.of(2026, 10, 15));
        contract.setStatus("CONFIRMED");
        contract.setTableCount(30);
        contract.setReserveTableCount(3);
        contract.setTotalAmount(new BigDecimal("165000000.00"));
        contract.setDepositAmount(new BigDecimal("50000000.00"));
        contract.setCustomer(customer);
        contract.setEvent(event);
    }

    @Test
    @DisplayName("B01 & B02: Render contract approved email with Vietnamese diacritics")
    void shouldRenderContractApprovedEmail_withVietnameseDiacritics() {
        String subject = templateService.buildContractApprovedSubject(contract);
        String html = templateService.buildContractApprovedHtml(contract);
        String text = templateService.buildContractApprovedText(contract);

        assertTrue(subject.contains("HD-20261120-001"));
        assertTrue(html.contains("Nguyễn Văn Hoàng"));
        assertTrue(html.contains("Sảnh Kim Cương Hoàng Gia"));
        assertTrue(html.contains("165.000.000 VNĐ"));
        assertTrue(html.contains("50.000.000 VNĐ"));
        assertTrue(text.contains("HD-20261120-001"));
        assertTrue(text.contains("165.000.000 VNĐ"));
    }

    @Test
    @DisplayName("B05 & B06: Escape HTML tags and prevent XSS injection in customer name and event")
    void shouldEscapeHtmlInjectionInTemplates() {
        customer.setFullName("<script>alert('xss')</script> & \"Quotes\"");
        event.setEventName("<img src=x onerror=alert('hack')>");
        venue.setVenueName("<b>Sảnh Bold</b>");

        String html = templateService.buildContractApprovedHtml(contract);

        assertFalse(html.contains("<script>"));
        assertTrue(html.contains("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt; &amp; &quot;Quotes&quot;"));
        assertFalse(html.contains("<img src=x onerror=alert('hack')>"));
        assertTrue(html.contains("&lt;img src=x onerror=alert(&#39;hack&#39;)&gt;"));
    }

    @Test
    @DisplayName("B08: Handle missing optional fields gracefully without null text")
    void shouldHandleMissingOptionalFieldsSafely() {
        contract.setCustomer(null);
        contract.setEvent(null);
        contract.setContractCode(null);
        contract.setContractDate(null);
        contract.setTotalAmount(null);
        contract.setDepositAmount(null);

        String html = templateService.buildContractApprovedHtml(contract);
        assertNotNull(html);
        assertTrue(html.contains("Quý khách"));
        assertTrue(html.contains("HD-100"));
        assertTrue(html.contains("0 VNĐ"));
    }

    @Test
    @DisplayName("D11: Render deposit confirmation template with payment method and remaining balance")
    void shouldRenderDepositConfirmedTemplateCorrectly() {
        String subject = templateService.buildDepositConfirmedSubject(contract);
        String html = templateService.buildDepositConfirmedHtml(
                contract,
                new BigDecimal("50000000.00"),
                "Chuyển khoản Vietcombank",
                "VCB-987654321"
        );
        String text = templateService.buildDepositConfirmedText(
                contract,
                new BigDecimal("50000000.00"),
                "Chuyển khoản Vietcombank",
                "VCB-987654321"
        );

        assertTrue(subject.contains("HD-20261120-001"));
        assertTrue(html.contains("50.000.000 VNĐ"));
        assertTrue(html.contains("Chuyển khoản Vietcombank"));
        assertTrue(html.contains("VCB-987654321"));
        assertTrue(html.contains("115.000.000 VNĐ")); // 165M - 50M = 115M
        assertTrue(text.contains("115.000.000 VNĐ"));
    }

    @Test
    @DisplayName("E01: Render contract copy template")
    void shouldRenderContractCopyTemplate() {
        String subject = templateService.buildContractCopySubject(contract);
        String html = templateService.buildContractCopyHtml(contract);
        String text = templateService.buildContractCopyText(contract);

        assertTrue(subject.contains("HD-20261120-001"));
        assertTrue(html.contains("GỬI BẢN SAO HỢP ĐỒNG ĐIỆN TỬ"));
        assertTrue(html.contains("HD-20261120-001"));
        assertTrue(text.contains("HD-20261120-001"));
    }
}
