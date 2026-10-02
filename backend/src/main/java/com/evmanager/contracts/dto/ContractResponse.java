package com.evmanager.contracts.dto;

import com.evmanager.contracts.model.ContractStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
public class ContractResponse {
    private Long contractId;
    private Long customerId;
    private Long eventId;
    private Integer backupTableCount;
    private String contractCode;
    private LocalDate contractDate;
    
    private BigDecimal subTotal;
    private BigDecimal discountPercent;
    private BigDecimal vatPercent;
    private BigDecimal totalAmount;
    private BigDecimal depositAmount;
    
    private ContractStatus status;
    private List<ContractServiceResponse> services;
    private List<ContractMenuResponse> menus;
    
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
