package com.evmanager.events.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class EventRequest {
    @NotNull
    private Long venueId;
    
    @NotBlank
    private String eventName;
    
    @NotNull
    private OffsetDateTime startAt;
    
    @NotNull
    private OffsetDateTime endAt;
    
    private Integer guestCount;
}
