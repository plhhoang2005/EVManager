package com.evmanager.contracts.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ContractMenuResponse {
    private Long menuId;
    private String menuName;
    private Integer tableCount;
    private BigDecimal agreedPrice;
}
