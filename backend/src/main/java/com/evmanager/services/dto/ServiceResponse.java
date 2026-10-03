package com.evmanager.services.dto;

import com.evmanager.services.model.ServiceStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Builder
public class ServiceResponse {
    private Long serviceId;
    private String serviceName;
    private String description;
    private BigDecimal unitPrice;
    private ServiceStatus status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
