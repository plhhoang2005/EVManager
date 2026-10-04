package com.evmanager.services.dto;

import com.evmanager.services.model.ServiceStatus;
import jakarta.validation.constraints.Min;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceUpdateRequest {

    @Min(value = 0, message = "Unit price cannot be negative")
    private BigDecimal unitPrice;

    private ServiceStatus status;
}
