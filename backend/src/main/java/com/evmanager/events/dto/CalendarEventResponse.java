package com.evmanager.events.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Map;

@Data
@Builder
public class CalendarEventResponse {
    private String id;
    private String title;
    private OffsetDateTime start;
    private OffsetDateTime end;
    private Map<String, Object> extendedProps;
}
