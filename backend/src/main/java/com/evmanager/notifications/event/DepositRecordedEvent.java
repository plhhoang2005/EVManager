package com.evmanager.notifications.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.math.BigDecimal;

@Getter
public class DepositRecordedEvent extends ApplicationEvent {
    private final Long contractId;
    private final BigDecimal depositAmount;
    private final String paymentMethod;
    private final String transactionCode;

    public DepositRecordedEvent(Object source, Long contractId, BigDecimal depositAmount, String paymentMethod, String transactionCode) {
        super(source);
        this.contractId = contractId;
        this.depositAmount = depositAmount;
        this.paymentMethod = paymentMethod;
        this.transactionCode = transactionCode;
    }
}
