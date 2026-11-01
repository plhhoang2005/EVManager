package com.evmanager.events.service;

import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.exception.ResourceConflictException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConflictCheckerService {

    private final EventRepository eventRepository;

    private static final int BUFFER_MINUTES = 60;

    public void checkVenueAvailability(Long venueId, OffsetDateTime startTime, OffsetDateTime endTime) {
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("Start time and end time must not be null");
        }
        if (endTime.isBefore(startTime) || endTime.isEqual(startTime)) {
            throw new IllegalArgumentException("End time must be strictly after start time");
        }

        OffsetDateTime bufferedStart = startTime.minusMinutes(BUFFER_MINUTES);
        OffsetDateTime bufferedEnd = endTime.plusMinutes(BUFFER_MINUTES);

        List<Event> conflicts = eventRepository.findConflictingEvents(venueId, bufferedStart, bufferedEnd);

        if (!conflicts.isEmpty()) {
            Event conflict = conflicts.get(0);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            
            String msg = String.format("Venue conflict detected! Existing event '%s' is scheduled from %s to %s. A buffer of %d minutes is required.",
                    conflict.getEventName(),
                    conflict.getStartAt().format(formatter),
                    conflict.getEndAt().format(formatter),
                    BUFFER_MINUTES);
                    
            throw new ResourceConflictException(msg);
        }
    }
}
