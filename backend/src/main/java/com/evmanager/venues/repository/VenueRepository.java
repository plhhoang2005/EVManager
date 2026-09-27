package com.evmanager.venues.repository;

import com.evmanager.venues.model.Venue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VenueRepository extends JpaRepository<Venue, Long> {
    
    @Query("SELECT v FROM Venue v WHERE v.status != 'INACTIVE' AND " +
           "(:keyword IS NULL OR LOWER(v.venueName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(v.address) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Venue> findActiveVenues(@Param("keyword") String keyword, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM events WHERE venue_id = :venueId AND status IN ('SCHEDULED', 'PREPARING', 'IN_PROGRESS')", nativeQuery = true)
    long countActiveEventsForVenue(@Param("venueId") Long venueId);
}
