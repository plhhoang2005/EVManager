package com.evmanager.events.repository;

import com.evmanager.events.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Event e WHERE e.eventId = :eventId")
    Optional<Event> findByIdWithPessimisticWriteLock(@Param("eventId") Long eventId);

    @Query("SELECT e FROM Event e WHERE e.venue.venueId = :venueId " +
           "AND e.status != 'CANCELLED' " +
           "AND e.startAt < :bufferedEnd " +
           "AND e.endAt > :bufferedStart")
    List<Event> findConflictingEvents(
            @Param("venueId") Long venueId,
            @Param("bufferedStart") OffsetDateTime bufferedStart,
            @Param("bufferedEnd") OffsetDateTime bufferedEnd);

    @Query("SELECT e FROM Event e JOIN FETCH e.venue WHERE e.startAt < :end AND e.endAt > :start")
    List<Event> findEventsInRange(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    @Query("SELECT e.venue.venueId, COUNT(e), COALESCE(SUM(CASE WHEN c.status IN ('CONFIRMED', 'COMPLETED') THEN c.totalAmount ELSE 0 END), 0) " +
           "FROM Event e LEFT JOIN Contract c ON c.event = e " +
           "WHERE e.status != 'CANCELLED' " +
           "AND e.startAt >= :startDateTime AND e.startAt <= :endDateTime " +
           "GROUP BY e.venue.venueId")
    List<Object[]> aggregateVenueOccupancyAndRevenue(
            @Param("startDateTime") OffsetDateTime startDateTime,
            @Param("endDateTime") OffsetDateTime endDateTime);
}
