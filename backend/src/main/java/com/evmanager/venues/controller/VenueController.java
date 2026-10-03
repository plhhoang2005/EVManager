package com.evmanager.venues.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/venues")
public class VenueController {

    // Any authenticated user can view venues
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<String>> getVenues() {
        return ResponseEntity.ok(List.of("Venue A", "Venue B"));
    }

    // Only ADMIN can create venues
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createVenue(@RequestBody String venueName) {
        return ResponseEntity.ok("Venue '" + venueName + "' created successfully");
    }
}
