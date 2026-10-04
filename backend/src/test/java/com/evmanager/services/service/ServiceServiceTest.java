package com.evmanager.services.service;

import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.services.dto.ServiceRequest;
import com.evmanager.services.dto.ServiceResponse;
import com.evmanager.services.dto.ServiceUpdateRequest;
import com.evmanager.services.model.Service;
import com.evmanager.services.model.ServiceStatus;
import com.evmanager.services.repository.ServiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ServiceServiceTest {

    @Mock
    private ServiceRepository serviceRepository;

    @InjectMocks
    private ServiceService serviceService;

    private ServiceRequest createRequest;
    private ServiceUpdateRequest updateRequest;

    @BeforeEach
    void setUp() {
        createRequest = new ServiceRequest();
        createRequest.setServiceName("MC");
        createRequest.setUnitPrice(BigDecimal.valueOf(1000000));
        createRequest.setDescription("Master of Ceremonies");

        updateRequest = new ServiceUpdateRequest();
        updateRequest.setUnitPrice(BigDecimal.valueOf(1200000));
        updateRequest.setStatus(ServiceStatus.INACTIVE);
    }

    @Test
    void createService_Success() {
        when(serviceRepository.findByServiceName(createRequest.getServiceName())).thenReturn(Optional.empty());
        
        Service mockService = new Service();
        mockService.setServiceId(1L);
        mockService.setServiceName("MC");
        mockService.setUnitPrice(BigDecimal.valueOf(1000000));
        mockService.setStatus(ServiceStatus.ACTIVE);
        when(serviceRepository.save(any(Service.class))).thenReturn(mockService);

        ServiceResponse response = serviceService.createService(createRequest);
        
        assertNotNull(response);
        assertEquals(1L, response.getServiceId());
        assertEquals("MC", response.getServiceName());
        assertEquals(ServiceStatus.ACTIVE, response.getStatus());
        verify(serviceRepository).save(any(Service.class));
    }

    @Test
    void createService_DuplicateName_ThrowsException() {
        when(serviceRepository.findByServiceName(createRequest.getServiceName())).thenReturn(Optional.of(new Service()));

        assertThrows(ResourceConflictException.class, () -> serviceService.createService(createRequest));
    }

    @Test
    void updateService_NotFound_ThrowsException() {
        when(serviceRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> serviceService.updateService(999L, updateRequest));
    }

    @Test
    void updateService_UnitPrice_Success() {
        Service existing = new Service();
        existing.setServiceId(1L);
        existing.setUnitPrice(BigDecimal.valueOf(1000000));
        
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(serviceRepository.save(any(Service.class))).thenReturn(existing);

        ServiceUpdateRequest request = new ServiceUpdateRequest();
        request.setUnitPrice(BigDecimal.valueOf(1200000));

        ServiceResponse response = serviceService.updateService(1L, request);
        
        assertNotNull(response);
        assertEquals(BigDecimal.valueOf(1200000), existing.getUnitPrice());
    }

    @Test
    void updateService_Status_Success() {
        Service existing = new Service();
        existing.setServiceId(1L);
        existing.setStatus(ServiceStatus.ACTIVE);
        
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(serviceRepository.save(any(Service.class))).thenReturn(existing);

        ServiceUpdateRequest request = new ServiceUpdateRequest();
        request.setStatus(ServiceStatus.INACTIVE);

        ServiceResponse response = serviceService.updateService(1L, request);
        
        assertNotNull(response);
        assertEquals(ServiceStatus.INACTIVE, existing.getStatus());
    }

    @Test
    void getActiveServices_Success() {
        Service s1 = new Service();
        s1.setStatus(ServiceStatus.ACTIVE);
        Page<Service> page = new PageImpl<>(List.of(s1));
        
        PageRequest pageRequest = PageRequest.of(0, 10);
        when(serviceRepository.findByStatus(ServiceStatus.ACTIVE, pageRequest)).thenReturn(page);

        Page<ServiceResponse> response = serviceService.getActiveServices(pageRequest);
        
        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }
}
