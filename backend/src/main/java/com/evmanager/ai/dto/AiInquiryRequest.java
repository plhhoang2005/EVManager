package com.evmanager.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AiInquiryRequest {

    @NotBlank(message = "Họ và tên khách hàng không được để trống")
    @Size(max = 100, message = "Họ và tên tối đa 100 ký tự")
    private String fullName;

    @NotBlank(message = "Số điện thoại liên hệ không được để trống")
    @Size(min = 9, max = 20, message = "Số điện thoại phải từ 9 đến 20 ký tự")
    private String phone;

    private String email;
    private String eventType;
    private Integer guestCount;
    private Double budget;
    private String specialNotes;
    private String planSummary;

    public AiInquiryRequest() {
    }

    public AiInquiryRequest(String fullName, String phone, String email, String eventType, Integer guestCount, Double budget, String specialNotes, String planSummary) {
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.eventType = eventType;
        this.guestCount = guestCount;
        this.budget = budget;
        this.specialNotes = specialNotes;
        this.planSummary = planSummary;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public Integer getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public String getSpecialNotes() {
        return specialNotes;
    }

    public void setSpecialNotes(String specialNotes) {
        this.specialNotes = specialNotes;
    }

    public String getPlanSummary() {
        return planSummary;
    }

    public void setPlanSummary(String planSummary) {
        this.planSummary = planSummary;
    }
}
