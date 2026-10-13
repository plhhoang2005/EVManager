package com.evmanager.venues.repository;

import com.evmanager.venues.model.Venue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.Optional;

public interface VenueRepository extends JpaRepository<Venue, Long> {
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM Venue v WHERE v.venueId = :venueId")
    Optional<Venue> findByIdWithPessimisticWriteLock(@Param("venueId") Long venueId);
    
    @Query("SELECT v FROM Venue v WHERE v.status != 'INACTIVE' AND " +
           "(:keyword IS NULL OR LOWER(v.venueName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(v.address) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Venue> findActiveVenues(@Param("keyword") String keyword, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM events WHERE venue_id = :venueId AND status IN ('SCHEDULED', 'PREPARING', 'IN_PROGRESS')", nativeQuery = true)
    long countActiveEventsForVenue(@Param("venueId") Long venueId);

    @Query("SELECT v FROM Venue v WHERE v.status = 'AVAILABLE' " +
           "AND v.venueId NOT IN (" +
           "  SELECT e.venue.venueId FROM Event e WHERE e.status != 'CANCELLED' " +
           "  AND e.startAt < :bufferedEnd AND e.endAt > :bufferedStart" +
           ")")
    java.util.List<Venue> findAvailableVenues(
            @Param("bufferedStart") java.time.OffsetDateTime bufferedStart, 
            @Param("bufferedEnd") java.time.OffsetDateTime bufferedEnd);
}
