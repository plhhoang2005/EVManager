package com.evmanager.events.service;

import com.evmanager.events.dto.CalendarEventResponse;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
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
}
