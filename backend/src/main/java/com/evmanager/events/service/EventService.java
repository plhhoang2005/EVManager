package com.evmanager.events.service;

import com.evmanager.events.dto.CalendarEventResponse;
import com.evmanager.events.dto.EventRequest;
import com.evmanager.events.dto.EventResponse;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.venues.model.Venue;
import com.evmanager.venues.repository.VenueRepository;
import com.evmanager.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final ConflictCheckerService conflictCheckerService;
    private final VenueRepository venueRepository;

    @Transactional(readOnly = true)
    public List<CalendarEventResponse> getEventsForCalendar(OffsetDateTime start, OffsetDateTime end) {
        List<Event> events = eventRepository.findEventsInRange(start, end);

        return events.stream().map(event -> {
            Map<String, Object> props = new HashMap<>();
            props.put("venueId", event.getVenue().getVenueId());
            props.put("venueName", event.getVenue().getVenueName());
            props.put("status", event.getStatus());
            props.put("guestCount", event.getGuestCount());

            return CalendarEventResponse.builder()
                    .id(String.valueOf(event.getEventId()))
                    .title(event.getEventName())
                    .start(event.getStartAt())
                    .end(event.getEndAt())
                    .extendedProps(props)
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public EventResponse createEvent(EventRequest request) {
        conflictCheckerService.checkVenueAvailability(request.getVenueId(), request.getStartAt(), request.getEndAt());

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found: " + request.getVenueId()));

        Event event = new Event();
        event.setVenue(venue);
        event.setEventName(request.getEventName());
        event.setStartAt(request.getStartAt());
        event.setEndAt(request.getEndAt());
        event.setGuestCount(request.getGuestCount() != null ? request.getGuestCount() : 100);
        event.setStatus("SCHEDULED");

        event = eventRepository.save(event);

        return EventResponse.builder()
                .eventId(event.getEventId())
                .venueId(event.getVenue().getVenueId())
                .eventName(event.getEventName())
                .startAt(event.getStartAt())
                .endAt(event.getEndAt())
                .guestCount(event.getGuestCount())
                .status(event.getStatus())
                .build();
    }
}
