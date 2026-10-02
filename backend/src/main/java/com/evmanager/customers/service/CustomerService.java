package com.evmanager.customers.service;

import com.evmanager.customers.dto.CustomerCreateRequest;
import com.evmanager.customers.dto.CustomerResponse;
import com.evmanager.customers.dto.CustomerUpdateRequest;
import com.evmanager.customers.model.Customer;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Transactional(readOnly = true)
    public Page<CustomerResponse> getCustomers(String keyword, Pageable pageable) {
        Page<Customer> customers;
        if (keyword != null && !keyword.isBlank()) {
            customers = customerRepository.searchCustomers(keyword, pageable);
        } else {
            customers = customerRepository.findAll(pageable);
        }
        return customers.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));
        return mapToResponse(customer);
    }

    @Transactional
    public CustomerResponse createCustomer(CustomerCreateRequest request) {
        boolean hasPhone = request.getPhone() != null && !request.getPhone().trim().isEmpty();
        boolean hasEmail = request.getEmail() != null && !request.getEmail().trim().isEmpty();
        
        if (!hasPhone && !hasEmail) {
            throw new IllegalArgumentException("Customer must have either a phone number or an email");
        }
        
        if (hasPhone && customerRepository.findByPhone(request.getPhone().trim()).isPresent()) {
            throw new ResourceConflictException("Phone number already exists");
        }
        if (hasEmail && customerRepository.findByEmailIgnoreCase(request.getEmail().trim()).isPresent()) {
            throw new ResourceConflictException("Email already exists");
        }

        Customer customer = new Customer();
        customer.setFullName(request.getFullName().trim());
        customer.setPhone(hasPhone ? request.getPhone().trim() : null);
        customer.setEmail(hasEmail ? request.getEmail().trim().toLowerCase() : null);
        customer.setAddress(request.getAddress() != null && !request.getAddress().trim().isEmpty() ? request.getAddress().trim() : null);

        return mapToResponse(customerRepository.save(customer));
    }

    @Transactional
    public CustomerResponse updateCustomer(Long customerId, CustomerUpdateRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        boolean hasPhone = request.getPhone() != null && !request.getPhone().trim().isEmpty();
        boolean hasEmail = request.getEmail() != null && !request.getEmail().trim().isEmpty();

        if (!hasPhone && !hasEmail) {
            throw new IllegalArgumentException("Customer must have either a phone number or an email");
        }

        if (hasPhone && !request.getPhone().trim().equals(customer.getPhone()) 
                && customerRepository.findByPhone(request.getPhone().trim()).isPresent()) {
            throw new ResourceConflictException("Phone number already exists");
        }
        
        if (hasEmail && !request.getEmail().trim().equalsIgnoreCase(customer.getEmail()) 
                && customerRepository.findByEmailIgnoreCase(request.getEmail().trim()).isPresent()) {
            throw new ResourceConflictException("Email already exists");
        }

        customer.setFullName(request.getFullName().trim());
        customer.setPhone(hasPhone ? request.getPhone().trim() : null);
        customer.setEmail(hasEmail ? request.getEmail().trim().toLowerCase() : null);
        customer.setAddress(request.getAddress() != null && !request.getAddress().trim().isEmpty() ? request.getAddress().trim() : null);

        return mapToResponse(customerRepository.save(customer));
    }

    @Transactional
    public void deleteCustomer(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer not found with ID: " + customerId);
        }
        try {
            customerRepository.deleteById(customerId);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new com.evmanager.exception.ResourceConflictException("Cannot delete customer because they have related contracts or events");
        }
    }

    private CustomerResponse mapToResponse(Customer customer) {
        CustomerResponse response = new CustomerResponse();
        response.setCustomerId(customer.getCustomerId());
        response.setFullName(customer.getFullName());
        response.setPhone(customer.getPhone());
        response.setEmail(customer.getEmail());
        response.setAddress(customer.getAddress());
        response.setCreatedAt(customer.getCreatedAt());
        response.setUpdatedAt(customer.getUpdatedAt());
        return response;
    }
}
