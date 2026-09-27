package com.evmanager.events.repository;

import com.evmanager.events.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT e FROM Event e WHERE e.venueId = :venueId " +
           "AND e.status != 'CANCELLED' " +
           "AND e.startAt < :bufferedEnd " +
           "AND e.endAt > :bufferedStart")
    List<Event> findConflictingEvents(
            @Param("venueId") Long venueId,
            @Param("bufferedStart") OffsetDateTime bufferedStart,
            @Param("bufferedEnd") OffsetDateTime bufferedEnd);
}
