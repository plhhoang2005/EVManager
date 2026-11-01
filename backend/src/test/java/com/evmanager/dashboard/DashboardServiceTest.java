package com.evmanager.dashboard;

import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.dashboard.dto.DashboardSummaryResponse;
import com.evmanager.dashboard.service.DashboardService;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.venues.model.Venue;
import com.evmanager.venues.repository.VenueRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private ContractRepository contractRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    @DisplayName("Should calculate dashboard summary metrics accurately")
    void testGetDashboardSummary() {
        // Arrange
        when(eventRepository.count()).thenReturn(10L);
        when(eventRepository.countByStatus("CANCELLED")).thenReturn(1L);
        when(eventRepository.countByStatus("COMPLETED")).thenReturn(2L);

        when(customerRepository.count()).thenReturn(25L);
        when(contractRepository.count()).thenReturn(8L);
        when(contractRepository.countByStatus("DRAFT")).thenReturn(2L);
        when(contractRepository.countByStatus("PENDING_CONFIRMATION")).thenReturn(1L);

        when(contractRepository.sumTotalRevenue()).thenReturn(new BigDecimal("500000000.00"));
        when(contractRepository.sumTotalDeposits()).thenReturn(new BigDecimal("150000000.00"));
        when(venueRepository.countByStatus("AVAILABLE")).thenReturn(5L);

        Venue venue = new Venue();
        venue.setVenueName("Sảnh Diamond");

        Event event = new Event();
        event.setEventId(101L);
        event.setEventName("Gala Dinner TechCorp");
        event.setVenue(venue);
        event.setStartAt(OffsetDateTime.now());
        event.setGuestCount(200);
        event.setStatus("SCHEDULED");

        when(eventRepository.findTopRecentEvents(any(Pageable.class)))
                .thenReturn(Collections.singletonList(event));

        // Act
        DashboardSummaryResponse response = dashboardService.getDashboardSummary();

        // Assert
        assertNotNull(response);
        assertEquals(10L, response.getTotalEvents());
        assertEquals(7L, response.getActiveEvents());
        assertEquals(25L, response.getTotalCustomers());
        assertEquals(8L, response.getTotalContracts());
        assertEquals(3L, response.getPendingContracts());
        assertEquals(new BigDecimal("500000000.00"), response.getTotalRevenue());
        assertEquals(new BigDecimal("150000000.00"), response.getTotalDeposits());
        assertEquals(5L, response.getAvailableVenues());
        assertEquals(1, response.getRecentEvents().size());
        assertEquals("Gala Dinner TechCorp", response.getRecentEvents().get(0).getEventName());
        assertEquals("Sảnh Diamond", response.getRecentEvents().get(0).getVenueName());
        assertNotNull(response.getMonthlyRevenue());
    }

    @Test
    @DisplayName("Should handle null sums safely when database is empty")
    void testGetDashboardSummary_NullSums() {
        when(eventRepository.count()).thenReturn(0L);
        when(eventRepository.countByStatus("CANCELLED")).thenReturn(0L);
        when(eventRepository.countByStatus("COMPLETED")).thenReturn(0L);
        when(customerRepository.count()).thenReturn(0L);
        when(contractRepository.count()).thenReturn(0L);
        when(contractRepository.countByStatus("DRAFT")).thenReturn(0L);
        when(contractRepository.countByStatus("PENDING_CONFIRMATION")).thenReturn(0L);
        when(contractRepository.sumTotalRevenue()).thenReturn(null);
        when(contractRepository.sumTotalDeposits()).thenReturn(null);
        when(venueRepository.countByStatus("AVAILABLE")).thenReturn(0L);
        when(eventRepository.findTopRecentEvents(any(Pageable.class))).thenReturn(Collections.emptyList());

        DashboardSummaryResponse response = dashboardService.getDashboardSummary();

        assertNotNull(response);
        assertEquals(BigDecimal.ZERO, response.getTotalRevenue());
        assertEquals(BigDecimal.ZERO, response.getTotalDeposits());
        assertEquals(0L, response.getTotalEvents());
        assertEquals(0L, response.getActiveEvents());
        assertTrue(response.getRecentEvents().isEmpty());
    }
}
