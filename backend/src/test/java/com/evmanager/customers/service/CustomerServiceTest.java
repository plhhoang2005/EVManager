package com.evmanager.customers.service;

import com.evmanager.customers.dto.CustomerCreateRequest;
import com.evmanager.customers.dto.CustomerResponse;
import com.evmanager.customers.dto.CustomerUpdateRequest;
import com.evmanager.customers.model.Customer;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerService customerService;

    private Customer mockCustomer;
    private CustomerCreateRequest mockCreateRequest;
    private CustomerUpdateRequest mockUpdateRequest;

    @BeforeEach
    void setUp() {
        mockCustomer = new Customer();
        mockCustomer.setCustomerId(1L);
        mockCustomer.setFullName("Nguyen Van A");
        mockCustomer.setPhone("0901234567");
        mockCustomer.setEmail("nguyenvana@example.com");

        mockCreateRequest = new CustomerCreateRequest();
        mockCreateRequest.setFullName("Nguyen Van A");
        mockCreateRequest.setPhone("0901234567");
        mockCreateRequest.setEmail("nguyenvana@example.com");

        mockUpdateRequest = new CustomerUpdateRequest();
        mockUpdateRequest.setFullName("Nguyen Van B");
        mockUpdateRequest.setPhone("0901234568");
        mockUpdateRequest.setEmail("nguyenvanb@example.com");
    }

    @Test
    void createCustomer_Success() {
        when(customerRepository.findByPhone(anyString())).thenReturn(Optional.empty());
        when(customerRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(customerRepository.save(any(Customer.class))).thenReturn(mockCustomer);

        CustomerResponse response = customerService.createCustomer(mockCreateRequest);

        assertNotNull(response);
        assertEquals("Nguyen Van A", response.getFullName());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void createCustomer_PhoneConflict() {
        when(customerRepository.findByPhone(anyString())).thenReturn(Optional.of(mockCustomer));

        assertThrows(ResourceConflictException.class, () -> customerService.createCustomer(mockCreateRequest));
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    void updateCustomer_Success() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(mockCustomer));
        when(customerRepository.findByPhone(anyString())).thenReturn(Optional.empty());
        when(customerRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(customerRepository.save(any(Customer.class))).thenReturn(mockCustomer);

        CustomerResponse response = customerService.updateCustomer(1L, mockUpdateRequest);

        assertNotNull(response);
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    void updateCustomer_NotFound() {
        when(customerRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> customerService.updateCustomer(1L, mockUpdateRequest));
        verify(customerRepository, never()).save(any(Customer.class));
    }

    @Test
    void getCustomers_Success() {
        Page<Customer> page = new PageImpl<>(List.of(mockCustomer));
        when(customerRepository.searchCustomers(anyString(), any(PageRequest.class))).thenReturn(page);

        Page<CustomerResponse> response = customerService.getCustomers("Nguyen", PageRequest.of(0, 10));

        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
    }
}
