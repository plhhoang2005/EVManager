package com.evmanager.payments.dto;

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
public class PaymentResponse {
    private Long paymentId;
    private Long contractId;
    private String contractCode;
    private String customerName;
    private String externalReference;
    private String paymentType;
    private BigDecimal amount;
    private OffsetDateTime paymentDate;
    private String paymentMethod;
    private String status;
    private OffsetDateTime createdAt;
}
