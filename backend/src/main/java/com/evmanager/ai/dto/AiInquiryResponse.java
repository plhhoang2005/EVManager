package com.evmanager.ai.dto;

public class AiInquiryResponse {

    private String inquiryCode;
    private String customerName;
    private String status;
    private String message;
    private String createdAt;

    public AiInquiryResponse() {
    }

    public AiInquiryResponse(String inquiryCode, String customerName, String status, String message, String createdAt) {
        this.inquiryCode = inquiryCode;
        this.customerName = customerName;
        this.status = status;
        this.message = message;
        this.createdAt = createdAt;
    }

    public String getInquiryCode() {
        return inquiryCode;
    }

    public void setInquiryCode(String inquiryCode) {
        this.inquiryCode = inquiryCode;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
