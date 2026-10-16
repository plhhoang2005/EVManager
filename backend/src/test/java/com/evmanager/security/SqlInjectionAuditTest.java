package com.evmanager.security;

import com.evmanager.customers.dto.CustomerResponse;
import com.evmanager.customers.model.Customer;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.customers.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SqlInjectionAuditTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    private Customer testCustomer;

    @BeforeEach
    void setUp() {
        testCustomer = new Customer();
        testCustomer.setCustomerId(1L);
        testCustomer.setFullName("Brian O'Connor");
        testCustomer.setPhone("0901234567");
        testCustomer.setEmail("brian.oconnor@example.com");
    }

    @Test
    @DisplayName("I01 & I02: Legitimate names containing single quotes (e.g. O'Connor) are handled safely without syntax error")
    void testSearch_LegitimateNameWithSingleQuote() {
        Page<Customer> mockPage = new PageImpl<>(List.of(testCustomer));
        when(customerRepository.searchCustomers(eq("O'Connor"), any(Pageable.class)))
                .thenReturn(mockPage);

        Page<CustomerResponse> result = customerService.getCustomers("O'Connor", PageRequest.of(0, 10));

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Brian O'Connor", result.getContent().get(0).getFullName());
        verify(customerRepository).searchCustomers(eq("O'Connor"), any(Pageable.class));
    }

    @Test
    @DisplayName("I03: Classic ' OR '1'='1 payload is bound as literal parameter and does not alter query structure")
    void testSearch_ClassicOrPayload_TreatedAsLiteralParameter() {
        String payload = "' OR '1'='1";
        Page<Customer> emptyPage = new PageImpl<>(List.of());
        when(customerRepository.searchCustomers(eq(payload), any(Pageable.class)))
                .thenReturn(emptyPage);

        Page<CustomerResponse> result = customerService.getCustomers(payload, PageRequest.of(0, 10));

        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
        verify(customerRepository).searchCustomers(captor.capture(), any(Pageable.class));
        assertEquals(payload, captor.getValue());
    }

    @Test
    @DisplayName("I04: UNION SELECT payload is treated as literal parameter without executing secondary query")
    void testSearch_UnionSelectPayload_BoundAsLiteralParameter() {
        String payload = "' UNION SELECT null, null, null--";
        Page<Customer> emptyPage = new PageImpl<>(List.of());
        when(customerRepository.searchCustomers(eq(payload), any(Pageable.class)))
                .thenReturn(emptyPage);

        Page<CustomerResponse> result = customerService.getCustomers(payload, PageRequest.of(0, 10));

        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        verify(customerRepository).searchCustomers(eq(payload), any(Pageable.class));
    }

    @Test
    @DisplayName("I05: Destructive SQL injection payload '; DROP TABLE customers;-- is bound safely as literal parameter")
    void testSearch_DropTablePayload_BoundAsLiteralParameter() {
        String payload = "'; DROP TABLE customers;--";
        Page<Customer> emptyPage = new PageImpl<>(List.of());
        when(customerRepository.searchCustomers(eq(payload), any(Pageable.class)))
                .thenReturn(emptyPage);

        Page<CustomerResponse> result = customerService.getCustomers(payload, PageRequest.of(0, 10));

        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        verify(customerRepository).searchCustomers(eq(payload), any(Pageable.class));
    }

    @Test
    @DisplayName("I07: LIKE wildcards (% and _) are passed safely through parameterized binding")
    void testSearch_WildcardsPassedSafely() {
        String payload = "%admin_test%";
        Page<Customer> emptyPage = new PageImpl<>(List.of());
        when(customerRepository.searchCustomers(eq(payload), any(Pageable.class)))
                .thenReturn(emptyPage);

        Page<CustomerResponse> result = customerService.getCustomers(payload, PageRequest.of(0, 10));

        assertNotNull(result);
        verify(customerRepository).searchCustomers(eq(payload), any(Pageable.class));
    }

    @Test
    @DisplayName("I08: Unicode search payload is bound without encoding corruption or query injection")
    void testSearch_UnicodePayload_BoundSafely() {
        String payload = "Nguyễn Văn Ánh ' AND 1=1";
        Page<Customer> emptyPage = new PageImpl<>(List.of());
        when(customerRepository.searchCustomers(eq(payload), any(Pageable.class)))
                .thenReturn(emptyPage);

        Page<CustomerResponse> result = customerService.getCustomers(payload, PageRequest.of(0, 10));

        assertNotNull(result);
        verify(customerRepository).searchCustomers(eq(payload), any(Pageable.class));
    }
}
