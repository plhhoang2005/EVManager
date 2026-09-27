package com.evmanager.venues.service;

import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.venues.dto.VenueCreateRequest;
import com.evmanager.venues.dto.VenueResponse;
import com.evmanager.venues.dto.VenueUpdateRequest;
import com.evmanager.venues.model.Venue;
import com.evmanager.venues.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;

    @Transactional
    public VenueResponse createVenue(VenueCreateRequest request) {
        if (request.getMinCapacity() > request.getMaxCapacity()) {
            throw new IllegalArgumentException("Min capacity cannot be greater than max capacity");
        }

        Venue venue = new Venue();
        venue.setVenueName(request.getVenueName());
        venue.setAddress(request.getAddress());
        venue.setMinCapacity(request.getMinCapacity());
        venue.setMaxCapacity(request.getMaxCapacity());
        venue.setRentalPrice(request.getRentalPrice());

        Venue savedVenue = venueRepository.save(venue);
        return mapToResponse(savedVenue);
    }

    @Transactional(readOnly = true)
    public Page<VenueResponse> getVenues(String keyword, Pageable pageable) {
        return venueRepository.findActiveVenues(keyword, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public VenueResponse getVenueById(Long id) {
        Venue venue = venueRepository.findById(id)
                .filter(v -> !"INACTIVE".equals(v.getStatus()))
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));
        return mapToResponse(venue);
    }

    @Transactional
    public VenueResponse updateVenue(Long id, VenueUpdateRequest request) {
        Venue venue = venueRepository.findById(id)
                .filter(v -> !"INACTIVE".equals(v.getStatus()))
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));

        if (request.getVenueName() != null) venue.setVenueName(request.getVenueName());
        if (request.getAddress() != null) venue.setAddress(request.getAddress());
        
        if (request.getMinCapacity() != null) venue.setMinCapacity(request.getMinCapacity());
        if (request.getMaxCapacity() != null) venue.setMaxCapacity(request.getMaxCapacity());
        
        if (venue.getMinCapacity() > venue.getMaxCapacity()) {
            throw new IllegalArgumentException("Min capacity cannot be greater than max capacity");
        }

        if (request.getRentalPrice() != null) venue.setRentalPrice(request.getRentalPrice());
        if (request.getStatus() != null) venue.setStatus(request.getStatus());

        Venue updatedVenue = venueRepository.save(venue);
        return mapToResponse(updatedVenue);
    }

    @Transactional
    public void deleteVenue(Long id) {
        Venue venue = venueRepository.findById(id)
                .filter(v -> !"INACTIVE".equals(v.getStatus()))
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));

        // Check if venue is in use by active events
        long activeEvents = venueRepository.countActiveEventsForVenue(id);
        if (activeEvents > 0) {
            throw new IllegalStateException("Cannot delete venue because it has " + activeEvents + " active event(s)");
        }

        venue.setStatus("INACTIVE");
        venueRepository.save(venue);
    }

    private VenueResponse mapToResponse(Venue venue) {
        VenueResponse response = new VenueResponse();
        response.setVenueId(venue.getVenueId());
        response.setVenueName(venue.getVenueName());
        response.setAddress(venue.getAddress());
        response.setMinCapacity(venue.getMinCapacity());
        response.setMaxCapacity(venue.getMaxCapacity());
        response.setRentalPrice(venue.getRentalPrice());
        response.setStatus(venue.getStatus());
        response.setCreatedAt(venue.getCreatedAt());
        response.setUpdatedAt(venue.getUpdatedAt());
        return response;
    }
}
