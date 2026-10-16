package com.evmanager.contracts.service;

import com.evmanager.contracts.dto.ContractMenuRequest;
import com.evmanager.contracts.dto.ContractRequest;
import com.evmanager.contracts.dto.ContractResponse;
import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.model.Customer;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.menus.model.Menu;
import com.evmanager.menus.repository.MenuRepository;
import com.evmanager.services.model.Service;
import com.evmanager.services.repository.ServiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ContractPricingExhaustiveRegressionTest {

    @Mock
    private ContractRepository contractRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private MenuRepository menuRepository;

    @Mock
    private ServiceRepository serviceRepository;

    @InjectMocks
    private ContractService contractService;

    private Event testEvent;
    private Customer testCustomer;
    private Menu testMenu;

    @BeforeEach
    void setUp() {
        testCustomer = new Customer();
        testCustomer.setCustomerId(1L);
        testCustomer.setFullName("Trần Minh Đức");

        testEvent = new Event();
        testEvent.setEventId(20L);
        testEvent.setEventName("Gala Tiệc Cuối Năm");
        testEvent.setStartAt(OffsetDateTime.parse("2026-12-20T18:00:00+07:00"));
        testEvent.setEndAt(OffsetDateTime.parse("2026-12-20T22:00:00+07:00"));

        testMenu = new Menu();
        testMenu.setMenuId(10L);
        testMenu.setMenuName("Menu Vip");
        testMenu.setPrice(new BigDecimal("5000000")); // 5M per table
    }

    private void mockBaseEntities() {
        when(eventRepository.findByIdWithPessimisticWriteLock(20L)).thenReturn(Optional.of(testEvent));
        when(contractRepository.existsByEvent_EventId(20L)).thenReturn(false);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(menuRepository.findById(10L)).thenReturn(Optional.of(testMenu));
        when(contractRepository.save(any(Contract.class))).thenAnswer(i -> i.getArgument(0));
    }

    @Test
    @DisplayName("P01: Standard PM & QA BUG-03 Example (100M, 5% discount, 2M voucher -> 93.000.000đ before VAT)")
    void testPricing_P01_StandardBug03Example() {
        mockBaseEntities();

        ContractRequest req = new ContractRequest();
        req.setCustomerId(1L);
        req.setEventId(20L);
        req.setContractDate(LocalDate.of(2026, 12, 10));
        req.setTableCount(20); // 20 * 5M = 100M

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(10L);
        menuReq.setQuantity(20);
        menuReq.setAgreedPrice(new BigDecimal("5000000"));
        req.setMenus(List.of(menuReq));

        req.setDiscountPercent(new BigDecimal("5")); // 5% = 5.000.000
        req.setVoucherAmount(new BigDecimal("2000000")); // 2.000.000
        req.setVatPercent(BigDecimal.ZERO); // Before VAT

        ContractResponse resp = contractService.createContract(req);
        assertNotNull(resp);
        assertEquals(new BigDecimal("100000000"), resp.getSubTotal());
        // Net after 5% (95M) and voucher 2M (93M)
        assertEquals(new BigDecimal("93000000"), resp.getTotalAmount());
        assertNotEquals(new BigDecimal("93100000"), resp.getTotalAmount(), "Must NOT subtract voucher before discount!");
        // Min deposit 30% of 93M = 27.900.000
        assertEquals(new BigDecimal("27900000.00"), resp.getDepositAmount());
    }

    @Test
    @DisplayName("P02: Discount percent only (no voucher)")
    void testPricing_P02_DiscountOnly() {
        mockBaseEntities();

        ContractRequest req = new ContractRequest();
        req.setCustomerId(1L);
        req.setEventId(20L);
        req.setContractDate(LocalDate.of(2026, 12, 10));
        req.setTableCount(20); // 100M

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(10L);
        menuReq.setQuantity(20);
        menuReq.setAgreedPrice(new BigDecimal("5000000"));
        req.setMenus(List.of(menuReq));

        req.setDiscountPercent(new BigDecimal("10")); // 10% = 10M -> 90M
        req.setVoucherAmount(BigDecimal.ZERO);
        req.setVatPercent(BigDecimal.ZERO);

        ContractResponse resp = contractService.createContract(req);
        assertEquals(new BigDecimal("90000000"), resp.getTotalAmount());
    }

    @Test
    @DisplayName("P03: Voucher only (no discount percent)")
    void testPricing_P03_VoucherOnly() {
        mockBaseEntities();

        ContractRequest req = new ContractRequest();
        req.setCustomerId(1L);
        req.setEventId(20L);
        req.setContractDate(LocalDate.of(2026, 12, 10));
        req.setTableCount(20); // 100M

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(10L);
        menuReq.setQuantity(20);
        menuReq.setAgreedPrice(new BigDecimal("5000000"));
        req.setMenus(List.of(menuReq));

        req.setDiscountPercent(BigDecimal.ZERO);
        req.setVoucherAmount(new BigDecimal("5000000")); // 5M voucher -> 95M
        req.setVatPercent(BigDecimal.ZERO);

        ContractResponse resp = contractService.createContract(req);
        assertEquals(new BigDecimal("95000000"), resp.getTotalAmount());
    }

    @Test
    @DisplayName("P04: Neither discount nor voucher")
    void testPricing_P04_NeitherDiscountNorVoucher() {
        mockBaseEntities();

        ContractRequest req = new ContractRequest();
        req.setCustomerId(1L);
        req.setEventId(20L);
        req.setContractDate(LocalDate.of(2026, 12, 10));
        req.setTableCount(20); // 100M

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(10L);
        menuReq.setQuantity(20);
        menuReq.setAgreedPrice(new BigDecimal("5000000"));
        req.setMenus(List.of(menuReq));

        ContractResponse resp = contractService.createContract(req);
        assertEquals(new BigDecimal("100000000"), resp.getTotalAmount());
    }

    @Test
    @DisplayName("P07: Discount 100% results in 0 totalAmount")
    void testPricing_P07_Discount100Percent() {
        mockBaseEntities();

        ContractRequest req = new ContractRequest();
        req.setCustomerId(1L);
        req.setEventId(20L);
        req.setContractDate(LocalDate.of(2026, 12, 10));
        req.setTableCount(20); // 100M

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(10L);
        menuReq.setQuantity(20);
        menuReq.setAgreedPrice(new BigDecimal("5000000"));
        req.setMenus(List.of(menuReq));

        req.setDiscountPercent(new BigDecimal("100")); // 100% discount
        req.setVatPercent(new BigDecimal("8"));

        ContractResponse resp = contractService.createContract(req);
        assertEquals(new BigDecimal("0"), resp.getTotalAmount());
        assertEquals(new BigDecimal("0.00"), resp.getDepositAmount());
    }

    @Test
    @DisplayName("P08-P09: Negative discount or discount > 100% is strictly rejected")
    void testPricing_P08_P09_InvalidDiscountPercent_Rejected() {
        when(eventRepository.findByIdWithPessimisticWriteLock(20L)).thenReturn(Optional.of(testEvent));
        when(contractRepository.existsByEvent_EventId(20L)).thenReturn(false);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));

        ContractRequest reqNeg = new ContractRequest();
        reqNeg.setCustomerId(1L);
        reqNeg.setEventId(20L);
        reqNeg.setContractDate(LocalDate.of(2026, 12, 10));
        reqNeg.setDiscountPercent(new BigDecimal("-5"));

        assertThrows(IllegalArgumentException.class, () -> contractService.createContract(reqNeg));

        ContractRequest reqOver = new ContractRequest();
        reqOver.setCustomerId(1L);
        reqOver.setEventId(20L);
        reqOver.setContractDate(LocalDate.of(2026, 12, 10));
        reqOver.setDiscountPercent(new BigDecimal("105"));

        assertThrows(IllegalArgumentException.class, () -> contractService.createContract(reqOver));
    }

    @Test
    @DisplayName("P10-P11: Negative voucher rejected; voucher > remaining clamped to 0 (no negative balance)")
    void testPricing_P10_P11_VoucherClamp() {
        when(eventRepository.findByIdWithPessimisticWriteLock(20L)).thenReturn(Optional.of(testEvent));
        when(contractRepository.existsByEvent_EventId(20L)).thenReturn(false);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));

        ContractRequest reqNegVoucher = new ContractRequest();
        reqNegVoucher.setCustomerId(1L);
        reqNegVoucher.setEventId(20L);
        reqNegVoucher.setContractDate(LocalDate.of(2026, 12, 10));
        reqNegVoucher.setVoucherAmount(new BigDecimal("-1000000"));

        assertThrows(IllegalArgumentException.class, () -> contractService.createContract(reqNegVoucher));

        // When voucher > subtotal
        when(menuRepository.findById(10L)).thenReturn(Optional.of(testMenu));
        when(contractRepository.save(any(Contract.class))).thenAnswer(i -> i.getArgument(0));

        ContractRequest reqHugeVoucher = new ContractRequest();
        reqHugeVoucher.setCustomerId(1L);
        reqHugeVoucher.setEventId(20L);
        reqHugeVoucher.setContractDate(LocalDate.of(2026, 12, 10));
        reqHugeVoucher.setTableCount(1); // 5M

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(10L);
        menuReq.setQuantity(1);
        menuReq.setAgreedPrice(new BigDecimal("5000000"));
        reqHugeVoucher.setMenus(List.of(menuReq));
        reqHugeVoucher.setVoucherAmount(new BigDecimal("20000000")); // 20M voucher on 5M table

        ContractResponse resp = contractService.createContract(reqHugeVoucher);
        assertEquals(new BigDecimal("0"), resp.getTotalAmount(), "Total must clamp to 0, never negative");
    }

    @Test
    @DisplayName("P22: VAT 8% applied accurately on netSubTotal after both discounts")
    void testPricing_P22_VatCalculation() {
        mockBaseEntities();

        ContractRequest req = new ContractRequest();
        req.setCustomerId(1L);
        req.setEventId(20L);
        req.setContractDate(LocalDate.of(2026, 12, 10));
        req.setTableCount(20); // 100M

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(10L);
        menuReq.setQuantity(20);
        menuReq.setAgreedPrice(new BigDecimal("5000000"));
        req.setMenus(List.of(menuReq));

        req.setDiscountPercent(new BigDecimal("5")); // 5M -> 95M
        req.setVoucherAmount(new BigDecimal("2000000")); // 2M -> Net = 93M
        req.setVatPercent(new BigDecimal("8")); // 8% of 93M = 7.440.000 -> Total = 100.440.000

        ContractResponse resp = contractService.createContract(req);
        assertEquals(new BigDecimal("100000000"), resp.getSubTotal());
        assertEquals(new BigDecimal("100440000"), resp.getTotalAmount());
        // Min deposit 30% of 100.440.000 = 30.132.000
        assertEquals(new BigDecimal("30132000.00"), resp.getDepositAmount());
    }

    @Test
    @DisplayName("P14: Fractional percentage discount (e.g. 2.5% on 100.000.000 = 2.500.000)")
    void testPricing_P14_FractionalDiscount() {
        mockBaseEntities();

        ContractRequest req = new ContractRequest();
        req.setCustomerId(1L);
        req.setEventId(20L);
        req.setContractDate(LocalDate.of(2026, 12, 10));
        req.setTableCount(20);

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(10L);
        menuReq.setQuantity(20);
        menuReq.setAgreedPrice(new BigDecimal("5000000"));
        req.setMenus(List.of(menuReq));

        req.setDiscountPercent(new BigDecimal("2.5")); // 2.5% of 100M = 2.5M
        req.setVoucherAmount(BigDecimal.ZERO);
        req.setVatPercent(BigDecimal.ZERO);

        ContractResponse resp = contractService.createContract(req);
        assertEquals(new BigDecimal("97500000"), resp.getTotalAmount());
    }

    @Test
    @DisplayName("P25: Contract with 0 tables (only services) with discount applied to subtotal")
    void testPricing_P25_ServicesOnlyWithDiscount() {
        when(eventRepository.findByIdWithPessimisticWriteLock(20L)).thenReturn(Optional.of(testEvent));
        when(contractRepository.existsByEvent_EventId(20L)).thenReturn(false);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));

        Service soundService = new Service();
        soundService.setServiceId(99L);
        soundService.setServiceName("Âm thanh ánh sáng");
        soundService.setUnitPrice(new BigDecimal("20000000")); // 20M

        when(serviceRepository.findById(99L)).thenReturn(Optional.of(soundService));
        when(contractRepository.save(any(Contract.class))).thenAnswer(i -> i.getArgument(0));

        ContractRequest req = new ContractRequest();
        req.setCustomerId(1L);
        req.setEventId(20L);
        req.setContractDate(LocalDate.of(2026, 12, 10));
        req.setServiceIds(List.of(99L)); // 20M service
        req.setDiscountPercent(new BigDecimal("10")); // 10% on 20M = 2M -> 18M
        req.setVoucherAmount(new BigDecimal("3000000")); // 3M voucher -> 15M
        req.setVatPercent(BigDecimal.ZERO);

        ContractResponse resp = contractService.createContract(req);
        assertEquals(new BigDecimal("20000000"), resp.getSubTotal());
        assertEquals(new BigDecimal("15000000"), resp.getTotalAmount());
    }
}
