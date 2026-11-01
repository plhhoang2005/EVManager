package com.evmanager.events.service;

import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.exception.ResourceConflictException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConflictCheckerServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private ConflictCheckerService conflictCheckerService;

    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private Event existingEvent;

    @BeforeEach
    void setUp() {
        startTime = OffsetDateTime.parse("2026-10-10T18:00:00Z");
        endTime = OffsetDateTime.parse("2026-10-10T22:00:00Z");

        existingEvent = new Event();
        existingEvent.setEventId(100L);
        existingEvent.setEventName("Wedding A");
        existingEvent.setStartAt(OffsetDateTime.parse("2026-10-10T14:00:00Z"));
        existingEvent.setEndAt(OffsetDateTime.parse("2026-10-10T17:00:00Z"));
    }

    @Test
    void testCheckVenueAvailability_NoConflict() {
        when(eventRepository.findConflictingEvents(
                eq(1L),
                eq(startTime.minusMinutes(60)),
                eq(endTime.plusMinutes(60))
        )).thenReturn(Collections.emptyList());

        assertDoesNotThrow(() -> conflictCheckerService.checkVenueAvailability(1L, startTime, endTime));
    }

    @Test
    void testCheckVenueAvailability_WithConflict() {
        when(eventRepository.findConflictingEvents(
                eq(1L),
                eq(startTime.minusMinutes(60)),
                eq(endTime.plusMinutes(60))
        )).thenReturn(List.of(existingEvent));

        ResourceConflictException exception = assertThrows(ResourceConflictException.class, 
                () -> conflictCheckerService.checkVenueAvailability(1L, startTime, endTime));

        assertTrue(exception.getMessage().contains("Venue conflict detected"));
        assertTrue(exception.getMessage().contains("Wedding A"));
    }

    @Test
    void testCheckVenueAvailability_InvalidTimes() {
        assertThrows(IllegalArgumentException.class, 
                () -> conflictCheckerService.checkVenueAvailability(1L, endTime, startTime));

        assertThrows(IllegalArgumentException.class, 
                () -> conflictCheckerService.checkVenueAvailability(1L, null, endTime));
    }
}
