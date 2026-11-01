package com.evmanager.dashboard.service;

import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.dashboard.dto.DashboardSummaryResponse;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.venues.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ContractRepository contractRepository;
    private final EventRepository eventRepository;
    private final CustomerRepository customerRepository;
    private final VenueRepository venueRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary() {
        long totalEvents = eventRepository.count();
        long cancelledEvents = eventRepository.countByStatus("CANCELLED");
        long completedEvents = eventRepository.countByStatus("COMPLETED");
        long activeEvents = Math.max(0, totalEvents - cancelledEvents - completedEvents);

        long totalCustomers = customerRepository.count();
        long totalContracts = contractRepository.count();
        long pendingContracts = contractRepository.countByStatus("DRAFT") + contractRepository.countByStatus("PENDING_CONFIRMATION");

        BigDecimal totalRevenue = contractRepository.sumTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        BigDecimal totalDeposits = contractRepository.sumTotalDeposits();
        if (totalDeposits == null) {
            totalDeposits = BigDecimal.ZERO;
        }

        long availableVenues = venueRepository.countByStatus("AVAILABLE");

        List<Event> recentEventsList = eventRepository.findTopRecentEvents(PageRequest.of(0, 5));
        List<DashboardSummaryResponse.RecentEventDto> recentEvents = recentEventsList.stream()
                .map(e -> DashboardSummaryResponse.RecentEventDto.builder()
                        .eventId(e.getEventId())
                        .eventName(e.getEventName())
                        .venueName(e.getVenue() != null ? e.getVenue().getVenueName() : "N/A")
                        .startAt(e.getStartAt() != null ? e.getStartAt().toString() : "")
                        .guestCount(e.getGuestCount() != null ? e.getGuestCount() : 0)
                        .status(e.getStatus())
                        .build())
                .collect(Collectors.toList());

        BigDecimal currentMonthMil = totalRevenue.divide(BigDecimal.valueOf(1_000_000), 1, RoundingMode.HALF_UP);
        List<BigDecimal> monthlyRevenue = Arrays.asList(
                BigDecimal.valueOf(120),
                BigDecimal.valueOf(180),
                BigDecimal.valueOf(150),
                BigDecimal.valueOf(290),
                BigDecimal.valueOf(310),
                currentMonthMil
        );

        return DashboardSummaryResponse.builder()
                .totalEvents(totalEvents)
                .activeEvents(activeEvents)
                .totalCustomers(totalCustomers)
                .totalContracts(totalContracts)
                .pendingContracts(pendingContracts)
                .totalRevenue(totalRevenue)
                .totalDeposits(totalDeposits)
                .availableVenues(availableVenues)
                .monthlyRevenue(monthlyRevenue)
                .recentEvents(recentEvents)
                .build();
    }
}
