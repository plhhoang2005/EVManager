package com.evmanager.notifications.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepositPaymentResponse {
    private Long contractId;
    private String contractCode;
    private BigDecimal depositAmount;
    private BigDecimal totalAmount;
    private BigDecimal remainingAmount;
    private String status;
    private String message;
    private OffsetDateTime recordedAt;
}
