package com.evmanager.events.controller;

import com.evmanager.events.dto.CalendarEventResponse;
import com.evmanager.events.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping("/calendar")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'SALES', 'COORDINATOR')")
    public ResponseEntity<List<CalendarEventResponse>> getEventsForCalendar(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime end) {
        return ResponseEntity.ok(eventService.getEventsForCalendar(start, end));
    }
}
