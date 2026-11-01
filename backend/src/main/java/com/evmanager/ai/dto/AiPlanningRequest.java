package com.evmanager.ai.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AiPlanningRequest {

    @NotBlank(message = "Loại sự kiện không được để trống")
    private String eventType;

    @NotNull(message = "Ngân sách dự kiến không được để trống")
    @Min(value = 0, message = "Ngân sách phải lớn hơn hoặc bằng 0")
    private Double totalBudget;

    @Min(value = 1, message = "Số lượng khách tối thiểu là 1")
    private Integer guestCount;

    private String specialNotes;

    public AiPlanningRequest() {
    }

    public AiPlanningRequest(String eventType, Double totalBudget, Integer guestCount, String specialNotes) {
        this.eventType = eventType;
        this.totalBudget = totalBudget;
        this.guestCount = guestCount;
        this.specialNotes = specialNotes;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public Double getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(Double totalBudget) {
        this.totalBudget = totalBudget;
    }

    public Integer getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }

    public String getSpecialNotes() {
        return specialNotes;
    }

    public void setSpecialNotes(String specialNotes) {
        this.specialNotes = specialNotes;
    }
}
