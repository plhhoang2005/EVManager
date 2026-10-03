package com.evmanager.services.service;

import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.services.dto.ServiceRequest;
import com.evmanager.services.dto.ServiceResponse;
import com.evmanager.services.dto.ServiceUpdateRequest;
import com.evmanager.services.model.Service;
import com.evmanager.services.model.ServiceStatus;
import com.evmanager.services.repository.ServiceRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@org.springframework.stereotype.Service
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public ServiceResponse createService(ServiceRequest request) {
        if (serviceRepository.findByServiceName(request.getServiceName()).isPresent()) {
            throw new ResourceConflictException("Service name already exists");
        }
        
        Service service = new Service();
        service.setServiceName(request.getServiceName());
        service.setDescription(request.getDescription());
        service.setUnitPrice(request.getUnitPrice());
        service.setStatus(ServiceStatus.ACTIVE);
        
        return mapToResponse(serviceRepository.save(service));
    }

    public Page<ServiceResponse> getActiveServices(Pageable pageable) {
        return serviceRepository.findByStatus(ServiceStatus.ACTIVE, pageable)
                .map(this::mapToResponse);
    }

    public ServiceResponse updateService(Long id, ServiceUpdateRequest request) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        
        if (request.getUnitPrice() != null) {
            service.setUnitPrice(request.getUnitPrice());
        }
        if (request.getStatus() != null) {
            service.setStatus(request.getStatus());
        }
        
        return mapToResponse(serviceRepository.save(service));
    }

    private ServiceResponse mapToResponse(Service service) {
        return ServiceResponse.builder()
                .serviceId(service.getServiceId())
                .serviceName(service.getServiceName())
                .description(service.getDescription())
                .unitPrice(service.getUnitPrice())
                .status(service.getStatus())
                .createdAt(service.getCreatedAt())
                .updatedAt(service.getUpdatedAt())
                .build();
    }
}
