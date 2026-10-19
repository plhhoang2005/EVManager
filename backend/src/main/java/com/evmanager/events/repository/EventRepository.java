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

import com.evmanager.reports.dto.EventExportDto;

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

    @Query("SELECT new com.evmanager.reports.dto.EventExportDto(" +
           "e.eventId, " +
           "c.contractCode, " +
           "e.eventName, " +
           "cust.fullName, " +
           "v.venueName, " +
           "e.startAt, " +
           "c.totalAmount, " +
           "e.status) " +
           "FROM Event e " +
           "JOIN e.venue v " +
           "LEFT JOIN Contract c ON c.event = e " +
           "LEFT JOIN c.customer cust " +
           "WHERE e.status != 'CANCELLED' " +
           "AND (:startDateTime IS NULL OR e.startAt >= :startDateTime) " +
           "AND (:endDateTime IS NULL OR e.startAt <= :endDateTime) " +
           "ORDER BY e.startAt ASC")
    List<EventExportDto> findEventsForExport(
            @Param("startDateTime") OffsetDateTime startDateTime,
            @Param("endDateTime") OffsetDateTime endDateTime);
}
