package com.evmanager.contracts.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ContractServiceResponse {
    private Long serviceId;
    private String serviceName;
    private Integer quantity;
    private BigDecimal agreedUnitPrice;
}
