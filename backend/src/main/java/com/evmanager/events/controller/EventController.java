package com.evmanager.events.controller;

import com.evmanager.events.dto.CalendarEventResponse;
import com.evmanager.events.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import com.evmanager.events.dto.EventRequest;
import com.evmanager.events.dto.EventResponse;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<CalendarEventResponse>> getAllEvents() {
        OffsetDateTime start = OffsetDateTime.now().minusYears(1);
        OffsetDateTime end = OffsetDateTime.now().plusYears(1);
        return ResponseEntity.ok(eventService.getEventsForCalendar(start, end));
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<CalendarEventResponse>> getEventsForCalendar(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime end) {
        return ResponseEntity.ok(eventService.getEventsForCalendar(start, end));
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(request));
    }
}
