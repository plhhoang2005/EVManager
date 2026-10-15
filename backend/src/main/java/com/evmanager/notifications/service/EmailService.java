package com.evmanager.notifications.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.notifications.dto.EmailSendResponse;

import java.math.BigDecimal;

public interface EmailService {

    /**
     * Luồng A: Gửi email tự động thông báo hợp đồng đã được xác nhận/ký.
     */
    void sendContractApprovedEmail(Contract contract);

    /**
     * Luồng B: Gửi email tự động xác nhận đã nhận tiền đặt cọc đợt 1.
     */
    void sendDepositConfirmedEmail(Contract contract, BigDecimal paidDeposit, String paymentMethod, String transactionCode);

    /**
     * Luồng C: Nhân viên chủ động gửi bản sao hợp đồng cho khách hàng kèm tệp PDF đính kèm.
     */
    EmailSendResponse sendContractWithPdfAttachment(Contract contract);
}
