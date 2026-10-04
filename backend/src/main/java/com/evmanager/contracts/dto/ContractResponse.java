package com.evmanager.contracts.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Data
public class ContractResponse {
    private Long contractId;
    private String contractCode;
    private Long customerId;
    private String customerName;
    private Long eventId;
    private String eventName;
    private Long menuId;
    private String menuName;
    private LocalDate contractDate;
    private BigDecimal totalAmount;
    private BigDecimal depositAmount;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private List<ContractServiceResponse> services;
}
