package com.evmanager.events.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class EventResponse {
    private Long eventId;
    private Long venueId;
    private String eventName;
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
    private Integer guestCount;
    private String status;
}
