package com.evmanager.payments.dto;

import com.evmanager.payments.entity.PaymentMethod;
import com.evmanager.payments.entity.PaymentStatus;
import com.evmanager.payments.entity.PaymentType;
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
    private PaymentType paymentType;
    private BigDecimal amount;
    private OffsetDateTime paymentDate;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private OffsetDateTime createdAt;
}
