package com.evmanager.contracts.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ContractServiceResponse {
    private Long serviceId;
    private String serviceName;
    private Integer quantity;
    private BigDecimal agreedUnitPrice;
    private String note;
}
