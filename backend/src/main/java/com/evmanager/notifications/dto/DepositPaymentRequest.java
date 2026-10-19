package com.evmanager.notifications.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepositPaymentRequest {

    @NotNull(message = "Số tiền đặt cọc không được để trống")
    @DecimalMin(value = "1.00", message = "Số tiền đặt cọc phải lớn hơn 0")
    private BigDecimal amount;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod;

    private String transactionCode;

    private String note;
}
