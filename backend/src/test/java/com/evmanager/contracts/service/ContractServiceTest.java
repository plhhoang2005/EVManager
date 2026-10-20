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
import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.menus.model.Menu;
import com.evmanager.menus.repository.MenuRepository;
import com.evmanager.services.model.Service;
import com.evmanager.services.repository.ServiceRepository;
import org.junit.jupiter.api.BeforeEach;
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
class ContractServiceTest {

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
    private Service testService;

    @BeforeEach
    void setUp() {
        testCustomer = new Customer();
        testCustomer.setCustomerId(1L);
        testCustomer.setFullName("Nguyễn Văn An");

        testEvent = new Event();
        testEvent.setEventId(10L);
        testEvent.setEventName("Tiệc cưới Hoàng Gia");
        testEvent.setStartAt(OffsetDateTime.parse("2026-10-25T18:00:00+07:00"));
        testEvent.setEndAt(OffsetDateTime.parse("2026-10-25T22:00:00+07:00"));
        testEvent.setGuestCount(200);

        testMenu = new Menu();
        testMenu.setMenuId(5L);
        testMenu.setMenuName("Set Menu Diamond");
        testMenu.setPrice(new BigDecimal("4500000"));

        testService = new Service();
        testService.setServiceId(8L);
        testService.setServiceName("Âm thanh ánh sáng sân khấu");
        testService.setUnitPrice(new BigDecimal("10000000"));
    }

    @Test
    void createContract_WithMenusList_Success() {
        ContractRequest request = new ContractRequest();
        request.setCustomerId(1L);
        request.setEventId(10L);
        request.setContractDate(LocalDate.of(2026, 10, 20));
        request.setTableCount(20);
        request.setReserveTableCount(2);

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(5L);
        menuReq.setQuantity(20);
        menuReq.setAgreedPrice(new BigDecimal("4500000"));
        request.setMenus(List.of(menuReq));
        request.setServiceIds(List.of(8L));

        when(eventRepository.findByIdWithPessimisticWriteLock(10L)).thenReturn(Optional.of(testEvent));
        when(contractRepository.existsByEvent_EventId(10L)).thenReturn(false);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(menuRepository.findById(5L)).thenReturn(Optional.of(testMenu));
        when(serviceRepository.findById(8L)).thenReturn(Optional.of(testService));
        when(contractRepository.save(any(Contract.class))).thenAnswer(invocation -> {
            Contract c = invocation.getArgument(0);
            c.setContractId(100L);
            return c;
        });

        ContractResponse response = contractService.createContract(request);

        assertNotNull(response);
        assertEquals(100L, response.getContractId());
        assertEquals("Tiệc cưới Hoàng Gia", response.getEventName());
        assertEquals("Nguyễn Văn An", response.getCustomerName());
        assertEquals(20, response.getTableCount());
        assertEquals(2, response.getReserveTableCount());
        
        // 20 tables * 4.500.000 + 10.000.000 service = 100.000.000
        BigDecimal expectedTotal = new BigDecimal("100000000");
        assertEquals(expectedTotal, response.getTotalAmount());
        assertEquals(new BigDecimal("30000000.00"), response.getDepositAmount());
        assertEquals("DRAFT", response.getStatus());

        // Verifying menu responses and backward compatibility fields
        assertNotNull(response.getMenus());
        assertEquals(1, response.getMenus().size());
        assertEquals(5L, response.getMenus().get(0).getMenuId());
        assertEquals("Set Menu Diamond", response.getMenus().get(0).getMenuName());
        assertEquals(5L, response.getMenuId());
        assertEquals("Set Menu Diamond", response.getMenuName());
    }

    @Test
    void createContract_WithLegacyMenuId_Success() {
        ContractRequest request = new ContractRequest();
        request.setCustomerId(1L);
        request.setEventId(10L);
        request.setContractDate(LocalDate.of(2026, 10, 20));
        request.setMenuId(5L); // Legacy field without menus array
        request.setMenus(null);
        request.setServiceIds(List.of(8L));

        when(eventRepository.findByIdWithPessimisticWriteLock(10L)).thenReturn(Optional.of(testEvent));
        when(contractRepository.existsByEvent_EventId(10L)).thenReturn(false);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(menuRepository.findById(5L)).thenReturn(Optional.of(testMenu));
        when(serviceRepository.findById(8L)).thenReturn(Optional.of(testService));
        when(contractRepository.save(any(Contract.class))).thenAnswer(invocation -> {
            Contract c = invocation.getArgument(0);
            c.setContractId(101L);
            return c;
        });

        ContractResponse response = contractService.createContract(request);

        assertNotNull(response);
        assertEquals(101L, response.getContractId());
        // 1 menu * 4.500.000 + 10.000.000 = 14.500.000
        assertEquals(new BigDecimal("14500000"), response.getTotalAmount());
        assertEquals(new BigDecimal("4350000.00"), response.getDepositAmount());
        assertEquals(5L, response.getMenuId());
        assertEquals("Set Menu Diamond", response.getMenuName());
        assertEquals(1, response.getMenus().size());
    }

    @Test
    void createContract_WithoutMenu_Success() {
        ContractRequest request = new ContractRequest();
        request.setCustomerId(1L);
        request.setEventId(10L);
        request.setContractDate(LocalDate.of(2026, 10, 20));
        request.setMenuId(null);
        request.setMenus(null);
        request.setServiceIds(List.of(8L));

        when(eventRepository.findByIdWithPessimisticWriteLock(10L)).thenReturn(Optional.of(testEvent));
        when(contractRepository.existsByEvent_EventId(10L)).thenReturn(false);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(serviceRepository.findById(8L)).thenReturn(Optional.of(testService));
        when(contractRepository.save(any(Contract.class))).thenAnswer(invocation -> {
            Contract c = invocation.getArgument(0);
            c.setContractId(102L);
            return c;
        });

        ContractResponse response = contractService.createContract(request);

        assertNotNull(response);
        assertEquals(new BigDecimal("10000000"), response.getTotalAmount());
        assertEquals(new BigDecimal("3000000.00"), response.getDepositAmount());
        assertNull(response.getMenuId());
        assertNull(response.getMenuName());
    }

    @Test
    void createContract_DateAfterEventDate_ThrowsIllegalArgumentException() {
        ContractRequest request = new ContractRequest();
        request.setCustomerId(1L);
        request.setEventId(10L);
        request.setContractDate(LocalDate.of(2026, 10, 26)); // Event is 2026-10-25

        when(eventRepository.findByIdWithPessimisticWriteLock(10L)).thenReturn(Optional.of(testEvent));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            contractService.createContract(request);
        });

        assertTrue(ex.getMessage().contains("Contract date cannot be after event start date"));
        verify(contractRepository, never()).save(any());
    }

    @Test
    void createContract_DuplicateContractForEvent_ThrowsResourceConflictException() {
        ContractRequest request = new ContractRequest();
        request.setCustomerId(1L);
        request.setEventId(10L);
        request.setContractDate(LocalDate.of(2026, 10, 20));

        when(eventRepository.findByIdWithPessimisticWriteLock(10L)).thenReturn(Optional.of(testEvent));
        when(contractRepository.existsByEvent_EventId(10L)).thenReturn(true);

        ResourceConflictException ex = assertThrows(ResourceConflictException.class, () -> {
            contractService.createContract(request);
        });

        assertTrue(ex.getMessage().contains("Event already has a contract"));
        verify(contractRepository, never()).save(any());
    }

    @Test
    void createContract_TC_CALC_01_BasicWithVat_Success() {
        // TC-CALC-01: 20 bàn * 4.500.000 + 10.000.000 dịch vụ = 100.000.000
        // Thuế VAT 8% = 8.000.000 -> Tổng = 108.000.000 -> Cọc 30% = 32.400.000
        ContractRequest request = new ContractRequest();
        request.setCustomerId(1L);
        request.setEventId(10L);
        request.setContractDate(LocalDate.of(2026, 10, 20));
        request.setTableCount(20);
        request.setReserveTableCount(2);

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(5L);
        menuReq.setQuantity(20);
        menuReq.setAgreedPrice(new BigDecimal("4500000"));
        request.setMenus(List.of(menuReq));
        request.setServiceIds(List.of(8L));
        request.setVatPercent(new BigDecimal("8"));

        when(eventRepository.findByIdWithPessimisticWriteLock(10L)).thenReturn(Optional.of(testEvent));
        when(contractRepository.existsByEvent_EventId(10L)).thenReturn(false);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(menuRepository.findById(5L)).thenReturn(Optional.of(testMenu));
        when(serviceRepository.findById(8L)).thenReturn(Optional.of(testService));
        when(contractRepository.save(any(Contract.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContractResponse response = contractService.createContract(request);

        assertNotNull(response);
        assertEquals(new BigDecimal("100000000"), response.getSubTotal());
        assertEquals(new BigDecimal("108000000"), response.getTotalAmount());
        assertEquals(new BigDecimal("32400000.00"), response.getDepositAmount());
    }

    @Test
    void createContract_TC_CALC_02_DiscountPercentOnTable_Success() {
        // TC-CALC-02: Tiền bàn 90.000.000, chiết khấu 10% bàn = 9.000.000 -> Bàn còn 81.000.000
        // Dịch vụ 10.000.000 -> Trước thuế = 91.000.000
        // VAT 8% = 7.280.000 -> Tổng = 98.280.000 -> Cọc 30% = 29.484.000
        ContractRequest request = new ContractRequest();
        request.setCustomerId(1L);
        request.setEventId(10L);
        request.setContractDate(LocalDate.of(2026, 10, 20));
        request.setTableCount(20);
        request.setReserveTableCount(2);

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(5L);
        menuReq.setQuantity(20);
        menuReq.setAgreedPrice(new BigDecimal("4500000"));
        request.setMenus(List.of(menuReq));
        request.setServiceIds(List.of(8L));
        request.setDiscountPercent(new BigDecimal("10"));
        request.setVatPercent(new BigDecimal("8"));

        when(eventRepository.findByIdWithPessimisticWriteLock(10L)).thenReturn(Optional.of(testEvent));
        when(contractRepository.existsByEvent_EventId(10L)).thenReturn(false);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(menuRepository.findById(5L)).thenReturn(Optional.of(testMenu));
        when(serviceRepository.findById(8L)).thenReturn(Optional.of(testService));
        when(contractRepository.save(any(Contract.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContractResponse response = contractService.createContract(request);

        assertNotNull(response);
        assertEquals(new BigDecimal("100000000"), response.getSubTotal());
        assertEquals(new BigDecimal("10"), response.getDiscountPercent());
        assertEquals(new BigDecimal("98280000"), response.getTotalAmount());
        assertEquals(new BigDecimal("29484000.00"), response.getDepositAmount());
    }

    @Test
    void createContract_TC_CALC_03_DepositValidation_FailsWhenUnder30Percent() {
        // TC-CALC-03: Dựa trên TC-CALC-02 (Tổng = 98.280.000, Cọc tối thiểu = 29.484.000)
        // Nhập tiền cọc 20.000.000 (< 29.484.000) -> Phải báo lỗi
        ContractRequest request = new ContractRequest();
        request.setCustomerId(1L);
        request.setEventId(10L);
        request.setContractDate(LocalDate.of(2026, 10, 20));
        request.setTableCount(20);

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(5L);
        menuReq.setQuantity(20);
        menuReq.setAgreedPrice(new BigDecimal("4500000"));
        request.setMenus(List.of(menuReq));
        request.setServiceIds(List.of(8L));
        request.setDiscountPercent(new BigDecimal("10"));
        request.setVatPercent(new BigDecimal("8"));
        request.setDepositAmount(new BigDecimal("20000000")); // Quá thấp

        when(eventRepository.findByIdWithPessimisticWriteLock(10L)).thenReturn(Optional.of(testEvent));
        when(contractRepository.existsByEvent_EventId(10L)).thenReturn(false);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(menuRepository.findById(5L)).thenReturn(Optional.of(testMenu));
        when(serviceRepository.findById(8L)).thenReturn(Optional.of(testService));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            contractService.createContract(request);
        });

        assertTrue(ex.getMessage().contains("Deposit amount must be at least 30% of total contract amount"));
        verify(contractRepository, never()).save(any());
    }

    @Test
    void createContract_TC_CALC_04_BigDecimalRoundingPrecision_Success() {
        // TC-CALC-04: Dịch vụ 10.000.001 đ, VAT 8% -> Thuế = 800.000,08 -> Làm tròn HALF_UP = 800.000
        // Tổng = 10.800.001 đ
        Service oddService = new Service();
        oddService.setServiceId(99L);
        oddService.setServiceName("Dịch vụ lẻ giá");
        oddService.setUnitPrice(new BigDecimal("10000001"));

        ContractRequest request = new ContractRequest();
        request.setCustomerId(1L);
        request.setEventId(10L);
        request.setContractDate(LocalDate.of(2026, 10, 20));
        request.setServiceIds(List.of(99L));
        request.setVatPercent(new BigDecimal("8"));

        when(eventRepository.findByIdWithPessimisticWriteLock(10L)).thenReturn(Optional.of(testEvent));
        when(contractRepository.existsByEvent_EventId(10L)).thenReturn(false);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(serviceRepository.findById(99L)).thenReturn(Optional.of(oddService));
        when(contractRepository.save(any(Contract.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContractResponse response = contractService.createContract(request);

        assertNotNull(response);
        assertEquals(new BigDecimal("10000001"), response.getSubTotal());
        assertEquals(new BigDecimal("10800001"), response.getTotalAmount());
    }

    @Test
    void createContract_BUG_03_SimultaneousDiscountPercentAndVoucher_Success() {
        // BUG-03 Regression Test:
        // Tiền bàn: 100.000.000 đ
        // Chiết khấu: 5%
        // Voucher giảm giá trực tiếp: 2.000.000 đ
        // QUY TẮC ĐÚNG:
        // 1. Tiền sau chiết khấu 5% = 100.000.000 - 5.000.000 = 95.000.000 đ
        // 2. Tiền sau voucher = 95.000.000 - 2.000.000 = 93.000.000 đ (KHÔNG PHẢI 93.100.000 đ!)
        Menu bigMenu = new Menu();
        bigMenu.setMenuId(50L);
        bigMenu.setMenuName("Set Menu Hoàng Gia");
        bigMenu.setPrice(new BigDecimal("5000000")); // 20 bàn * 5M = 100M

        ContractRequest request = new ContractRequest();
        request.setCustomerId(1L);
        request.setEventId(10L);
        request.setContractDate(LocalDate.of(2026, 10, 20));
        request.setTableCount(20);

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(50L);
        menuReq.setQuantity(20);
        menuReq.setAgreedPrice(new BigDecimal("5000000"));
        request.setMenus(List.of(menuReq));
        request.setDiscountPercent(new BigDecimal("5"));
        request.setVoucherAmount(new BigDecimal("2000000"));
        request.setVatPercent(BigDecimal.ZERO); // Theo ví dụ trong BUG-03 trước VAT

        when(eventRepository.findByIdWithPessimisticWriteLock(10L)).thenReturn(Optional.of(testEvent));
        when(contractRepository.existsByEvent_EventId(10L)).thenReturn(false);
        when(customerRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(menuRepository.findById(50L)).thenReturn(Optional.of(bigMenu));
        when(contractRepository.save(any(Contract.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContractResponse response = contractService.createContract(request);

        assertNotNull(response);
        assertEquals(new BigDecimal("100000000"), response.getSubTotal());
        assertEquals(new BigDecimal("5"), response.getDiscountPercent());
        assertEquals(new BigDecimal("2000000"), response.getVoucherAmount());
        // Khẳng định giá trị chính xác tuyệt đối là 93.000.000 đ
        assertEquals(new BigDecimal("93000000"), response.getTotalAmount());
        assertNotEquals(new BigDecimal("93100000"), response.getTotalAmount(), 
                "BUG-03 Regression Failure: Formula must NOT calculate voucher before discount!");
    }
}
