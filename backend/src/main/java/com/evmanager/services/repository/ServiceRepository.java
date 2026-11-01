package com.evmanager.services.repository;

import com.evmanager.services.model.Service;
import com.evmanager.services.model.ServiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    Optional<Service> findByServiceName(String serviceName);
    Page<Service> findByStatus(ServiceStatus status, Pageable pageable);
}
