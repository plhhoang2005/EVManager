package com.evmanager.contracts.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ContractMenuRequest {
    @NotNull(message = "Menu ID is required")
    private Long menuId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    private BigDecimal agreedPrice; // Optional, can be derived from Menu if null
    
    private String note;
}
