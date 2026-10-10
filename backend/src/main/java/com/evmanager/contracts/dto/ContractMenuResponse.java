package com.evmanager.contracts.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ContractMenuResponse {
    private Long menuId;
    private String menuName;
    private Integer quantity;
    private BigDecimal agreedPrice;
    private String note;
}
