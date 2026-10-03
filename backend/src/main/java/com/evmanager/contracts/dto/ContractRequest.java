package com.evmanager.contracts.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ContractRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @Valid
    @NotNull(message = "Event information is required")
    private EventRequest event;

    @Valid
    private List<ContractMenuRequest> menus;
    @Valid
    private List<ContractServiceRequest> services;

    @DecimalMin(value = "0.0", message = "Discount percent cannot be negative")
    @DecimalMax(value = "100.0", message = "Discount percent cannot exceed 100")
    private BigDecimal discountPercent = BigDecimal.ZERO;

    @DecimalMin(value = "0.0", message = "VAT percent cannot be negative")
    @DecimalMax(value = "100.0", message = "VAT percent cannot exceed 100")
    private BigDecimal vatPercent = BigDecimal.ZERO;
}
