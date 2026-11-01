package com.evmanager.payments.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCreateRequest {

    @NotNull(message = "contractId is required")
    private Long contractId;

    @NotNull(message = "amount is required")
    @DecimalMin(value = "1000", message = "Amount must be at least 1,000 VND")
    private BigDecimal amount;

    @NotBlank(message = "paymentType is required")
    @Pattern(regexp = "^(DEPOSIT|INSTALLMENT|FINAL|REFUND)$", message = "Invalid payment type")
    private String paymentType;

    @NotBlank(message = "paymentMethod is required")
    private String paymentMethod;

    private String externalReference;
}
