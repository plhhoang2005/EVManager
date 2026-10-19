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

    @Min(value = 0, message = "Table count cannot be negative")
    private Integer tableCount = 0;

    @Min(value = 0, message = "Reserve table count cannot be negative")
    private Integer reserveTableCount = 0;

    private Long menuId;
    private List<ContractMenuRequest> menus;
    @NotNull(message = "Contract date is required")
    private LocalDate contractDate;

    private List<Long> serviceIds;

    @Min(value = 0, message = "Discount percent cannot be negative")
    private java.math.BigDecimal discountPercent;

    @Min(value = 0, message = "Voucher amount cannot be negative")
    private java.math.BigDecimal voucherAmount;

    @Min(value = 0, message = "VAT percent cannot be negative")
    private java.math.BigDecimal vatPercent;

    @Min(value = 0, message = "Deposit amount cannot be negative")
    private java.math.BigDecimal depositAmount;
}
