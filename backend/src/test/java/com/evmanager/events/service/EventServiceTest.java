package com.evmanager.events.service;

import com.evmanager.events.dto.CalendarEventResponse;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.venues.model.Venue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    private OffsetDateTime start;
    private OffsetDateTime end;
    private Event event;

    @BeforeEach
    void setUp() {
        start = OffsetDateTime.parse("2026-10-01T00:00:00Z");
        end = OffsetDateTime.parse("2026-10-31T23:59:59Z");

        Venue venue = new Venue();
        venue.setVenueId(10L);
        venue.setVenueName("VIP Hall");

        event = new Event();
        event.setEventId(1L);
        event.setEventName("Corporate Party");
        event.setStartAt(OffsetDateTime.parse("2026-10-15T18:00:00Z"));
        event.setEndAt(OffsetDateTime.parse("2026-10-15T22:00:00Z"));
        event.setGuestCount(100);
        event.setStatus("SCHEDULED");
        event.setVenue(venue);
    }

    @Test
    void getEventsForCalendar_returnsCorrectFormat() {
        when(eventRepository.findEventsInRange(start, end)).thenReturn(List.of(event));

        List<CalendarEventResponse> result = eventService.getEventsForCalendar(start, end);

        assertEquals(1, result.size());
        CalendarEventResponse response = result.get(0);
        
        assertEquals("1", response.getId());
        assertEquals("Corporate Party", response.getTitle());
        assertEquals(event.getStartAt(), response.getStart());
        assertEquals(event.getEndAt(), response.getEnd());
        
        Map<String, Object> props = response.getExtendedProps();
        assertNotNull(props);
        assertEquals(10L, props.get("venueId"));
        assertEquals("VIP Hall", props.get("venueName"));
        assertEquals("SCHEDULED", props.get("status"));
        assertEquals(100, props.get("guestCount"));
    }
}
