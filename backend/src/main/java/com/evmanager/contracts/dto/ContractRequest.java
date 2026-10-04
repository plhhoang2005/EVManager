package com.evmanager.contracts.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class ContractRequest {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    private Long menuId;

    @NotNull(message = "Contract date is required")
    private LocalDate contractDate;

    private List<Long> serviceIds;
}
