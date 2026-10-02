package com.evmanager.contracts.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ContractMenuRequest {

    @NotNull(message = "Menu ID is required")
    private Long menuId;

    @NotNull(message = "Table count is required")
    @Min(value = 1, message = "Table count must be at least 1")
    private Integer tableCount;
}
