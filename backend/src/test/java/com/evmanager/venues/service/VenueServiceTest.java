package com.evmanager.venues.service;

import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.venues.dto.VenueCreateRequest;
import com.evmanager.venues.dto.VenueResponse;
import com.evmanager.venues.dto.VenueUpdateRequest;
import com.evmanager.venues.model.Venue;
import com.evmanager.venues.repository.VenueRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VenueServiceTest {

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private VenueService venueService;

    private Venue activeVenue;

    @BeforeEach
    void setUp() {
        activeVenue = new Venue();
        activeVenue.setVenueId(1L);
        activeVenue.setVenueName("Diamond Hall");
        activeVenue.setAddress("123 Street");
        activeVenue.setMinCapacity(50);
        activeVenue.setMaxCapacity(200);
        activeVenue.setRentalPrice(BigDecimal.valueOf(1000));
        activeVenue.setStatus("AVAILABLE");
    }

    @Test
    void testCreateVenue_Success() {
        VenueCreateRequest req = new VenueCreateRequest();
        req.setVenueName("Ruby Hall");
        req.setAddress("456 Ave");
        req.setMinCapacity(10);
        req.setMaxCapacity(100);
        req.setRentalPrice(BigDecimal.valueOf(500));

        when(venueRepository.save(any(Venue.class))).thenAnswer(i -> {
            Venue v = i.getArgument(0);
            v.setVenueId(2L);
            v.setStatus("AVAILABLE");
            return v;
        });

        VenueResponse res = venueService.createVenue(req);
        assertNotNull(res);
        assertEquals(2L, res.getVenueId());
        assertEquals("Ruby Hall", res.getVenueName());
    }

    @Test
    void testCreateVenue_InvalidCapacity() {
        VenueCreateRequest req = new VenueCreateRequest();
        req.setMinCapacity(200);
        req.setMaxCapacity(100);

        assertThrows(IllegalArgumentException.class, () -> venueService.createVenue(req));
    }

    @Test
    void testGetVenueById_Success() {
        when(venueRepository.findById(1L)).thenReturn(Optional.of(activeVenue));
        
        VenueResponse res = venueService.getVenueById(1L);
        assertEquals("Diamond Hall", res.getVenueName());
    }

    @Test
    void testGetVenueById_NotFound() {
        when(venueRepository.findById(99L)).thenReturn(Optional.empty());
        
        assertThrows(ResourceNotFoundException.class, () -> venueService.getVenueById(99L));
    }

    @Test
    void testGetVenueById_Inactive() {
        activeVenue.setStatus("INACTIVE");
        when(venueRepository.findById(1L)).thenReturn(Optional.of(activeVenue));
        
        assertThrows(ResourceNotFoundException.class, () -> venueService.getVenueById(1L));
    }

    @Test
    void testUpdateVenue_Success() {
        when(venueRepository.findById(1L)).thenReturn(Optional.of(activeVenue));
        when(venueRepository.save(any(Venue.class))).thenReturn(activeVenue);

        VenueUpdateRequest req = new VenueUpdateRequest();
        req.setStatus("MAINTENANCE");
        req.setRentalPrice(BigDecimal.valueOf(1500));

        VenueResponse res = venueService.updateVenue(1L, req);
        
        assertEquals("MAINTENANCE", res.getStatus());
        assertEquals(BigDecimal.valueOf(1500), res.getRentalPrice());
    }

    @Test
    void testDeleteVenue_Success() {
        when(venueRepository.findById(1L)).thenReturn(Optional.of(activeVenue));
        when(venueRepository.countActiveEventsForVenue(1L)).thenReturn(0L);
        when(venueRepository.save(any(Venue.class))).thenReturn(activeVenue);

        venueService.deleteVenue(1L);
        
        assertEquals("INACTIVE", activeVenue.getStatus());
    }

    @Test
    void testDeleteVenue_WithActiveEvents() {
        when(venueRepository.findById(1L)).thenReturn(Optional.of(activeVenue));
        when(venueRepository.countActiveEventsForVenue(1L)).thenReturn(2L);

        assertThrows(IllegalStateException.class, () -> venueService.deleteVenue(1L));
        assertEquals("AVAILABLE", activeVenue.getStatus());
    }

    @Test
    void testGetAvailableVenues() {
        java.time.LocalDate date = java.time.LocalDate.of(2026, 10, 10);
        when(venueRepository.findAvailableVenues(any(), any())).thenReturn(java.util.List.of(activeVenue));

        java.util.List<VenueResponse> lunchVenues = venueService.getAvailableVenues(date, "LUNCH");
        assertEquals(1, lunchVenues.size());
        assertEquals("Diamond Hall", lunchVenues.get(0).getVenueName());

        assertThrows(IllegalArgumentException.class, () -> venueService.getAvailableVenues(date, "INVALID"));
        assertThrows(IllegalArgumentException.class, () -> venueService.getAvailableVenues(null, "LUNCH"));
    }
}
