package com.evmanager.events;

import com.evmanager.events.dto.EventRequest;
import com.evmanager.events.dto.EventResponse;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.events.service.ConflictCheckerService;
import com.evmanager.events.service.EventService;
import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.venues.model.Venue;
import com.evmanager.venues.repository.VenueRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ConflictCheckerEdgeCasesTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private ConflictCheckerService conflictCheckerService;

    private Venue venue1;
    private Venue venue2;
    private final ZoneOffset vnOffset = ZoneOffset.ofHours(7);

    @BeforeEach
    void setUp() {
        venue1 = new Venue();
        venue1.setVenueId(1L);
        venue1.setVenueName("Sảnh Diamond");

        venue2 = new Venue();
        venue2.setVenueId(2L);
        venue2.setVenueName("Sảnh Ruby");
    }

    @Test
    @DisplayName("R01-R02: Overlapping event in same venue throws ResourceConflictException")
    void testCheckVenueAvailability_ConflictingEvent_ThrowsResourceConflictException() {
        OffsetDateTime start = OffsetDateTime.of(2026, 11, 20, 18, 0, 0, 0, vnOffset);
        OffsetDateTime end = OffsetDateTime.of(2026, 11, 20, 22, 0, 0, 0, vnOffset);

        Event existing = new Event();
        existing.setEventName("Tiệc Đã Có");
        existing.setStartAt(start);
        existing.setEndAt(end);

        when(eventRepository.findConflictingEvents(eq(1L), any(OffsetDateTime.class), any(OffsetDateTime.class)))
                .thenReturn(List.of(existing));

        ResourceConflictException ex = assertThrows(ResourceConflictException.class, () ->
            conflictCheckerService.checkVenueAvailability(1L, start, end)
        );

        assertTrue(ex.getMessage().contains("Venue conflict detected"));
        assertTrue(ex.getMessage().contains("Tiệc Đã Có"));
    }

    @Test
    @DisplayName("R04: Two events at different venues do not conflict")
    void testCheckVenueAvailability_DifferentVenues_NoConflict() {
        OffsetDateTime start = OffsetDateTime.of(2026, 11, 20, 18, 0, 0, 0, vnOffset);
        OffsetDateTime end = OffsetDateTime.of(2026, 11, 20, 22, 0, 0, 0, vnOffset);

        // Venue 1 has conflict, but Venue 2 does not
        when(eventRepository.findConflictingEvents(eq(2L), any(OffsetDateTime.class), any(OffsetDateTime.class)))
                .thenReturn(Collections.emptyList());

        assertDoesNotThrow(() -> conflictCheckerService.checkVenueAvailability(2L, start, end));
    }

    @Test
    @DisplayName("R05: Same venue without time overlap succeeds")
    void testCheckVenueAvailability_SameVenueNoOverlap_Success() {
        OffsetDateTime start = OffsetDateTime.of(2026, 11, 20, 8, 0, 0, 0, vnOffset);
        OffsetDateTime end = OffsetDateTime.of(2026, 11, 20, 12, 0, 0, 0, vnOffset);

        when(eventRepository.findConflictingEvents(eq(1L), any(OffsetDateTime.class), any(OffsetDateTime.class)))
                .thenReturn(Collections.emptyList());

        assertDoesNotThrow(() -> conflictCheckerService.checkVenueAvailability(1L, start, end));
    }

    @Test
    @DisplayName("R14-R15: Null start/end time or end <= start throws IllegalArgumentException")
    void testCheckVenueAvailability_InvalidDates_ThrowsIllegalArgumentException() {
        OffsetDateTime valid = OffsetDateTime.of(2026, 11, 20, 18, 0, 0, 0, vnOffset);

        assertThrows(IllegalArgumentException.class, () -> 
            conflictCheckerService.checkVenueAvailability(1L, null, valid)
        );
        assertThrows(IllegalArgumentException.class, () -> 
            conflictCheckerService.checkVenueAvailability(1L, valid, null)
        );
        assertThrows(IllegalArgumentException.class, () -> 
            conflictCheckerService.checkVenueAvailability(1L, valid, valid) // Equal
        );
        assertThrows(IllegalArgumentException.class, () -> 
            conflictCheckerService.checkVenueAvailability(1L, valid, valid.minusHours(1)) // End before start
        );
    }

    @Test
    @DisplayName("R24: Buffer calculation applies 60 minutes correctly to query range")
    void testCheckVenueAvailability_BufferMinutesApplied() {
        OffsetDateTime start = OffsetDateTime.of(2026, 11, 20, 18, 0, 0, 0, vnOffset);
        OffsetDateTime end = OffsetDateTime.of(2026, 11, 20, 22, 0, 0, 0, vnOffset);

        when(eventRepository.findConflictingEvents(eq(1L), any(OffsetDateTime.class), any(OffsetDateTime.class)))
                .thenReturn(Collections.emptyList());

        conflictCheckerService.checkVenueAvailability(1L, start, end);

        // Verify buffered start is start minus 60 min (17:00), buffered end is end plus 60 min (23:00)
        verify(eventRepository).findConflictingEvents(
                eq(1L),
                eq(start.minusMinutes(60)),
                eq(end.plusMinutes(60))
        );
    }
}
