package com.evmanager.reports.service;

import com.evmanager.events.repository.EventRepository;
import com.evmanager.reports.dto.VenueOccupancyItemDto;
import com.evmanager.reports.dto.VenueOccupancyReportResponse;
import com.evmanager.venues.model.Venue;
import com.evmanager.venues.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReportService {

    private static final ZoneId ZONE_VN = ZoneId.of("Asia/Ho_Chi_Minh");

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    @Transactional(readOnly = true)
    public VenueOccupancyReportResponse getVenueOccupancyReport(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("startDate and endDate are required");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("startDate cannot be after endDate");
        }

        long totalDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;

        OffsetDateTime startDateTime = startDate.atStartOfDay(ZONE_VN).toOffsetDateTime();
        OffsetDateTime endDateTime = endDate.atTime(LocalTime.MAX).atZone(ZONE_VN).toOffsetDateTime();

        List<Venue> allVenues = venueRepository.findAll();
        List<Object[]> rawAgg = eventRepository.aggregateVenueOccupancyAndRevenue(startDateTime, endDateTime);

        // Map aggregate results by venueId: [venueId -> (actualEvents, totalRevenue)]
        Map<Long, Object[]> aggMap = new HashMap<>();
        if (rawAgg != null) {
            for (Object[] row : rawAgg) {
                if (row != null && row.length >= 3 && row[0] != null) {
                    Long vId = ((Number) row[0]).longValue();
                    aggMap.put(vId, row);
                }
            }
        }

        List<VenueOccupancyItemDto> items = new ArrayList<>();
        for (Venue v : allVenues) {
            long availableShifts = "INACTIVE".equalsIgnoreCase(v.getStatus()) ? 0L : totalDays * 2L;

            long actualEvents = 0L;
            BigDecimal revenue = BigDecimal.ZERO;

            Object[] agg = aggMap.get(v.getVenueId());
            if (agg != null) {
                actualEvents = ((Number) agg[1]).longValue();
                if (agg[2] instanceof BigDecimal) {
                    revenue = (BigDecimal) agg[2];
                } else if (agg[2] != null) {
                    revenue = new BigDecimal(agg[2].toString());
                }
            }

            BigDecimal occupancyRate = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
            if (availableShifts > 0) {
                occupancyRate = BigDecimal.valueOf(actualEvents)
                        .multiply(BigDecimal.valueOf(100))
                        .divide(BigDecimal.valueOf(availableShifts), 2, RoundingMode.HALF_UP);
            }

            VenueOccupancyItemDto item = VenueOccupancyItemDto.builder()
                    .venueId(v.getVenueId())
                    .venueName(v.getVenueName())
                    .capacity(v.getMaxCapacity())
                    .status(v.getStatus())
                    .rentalPrice(v.getRentalPrice() != null ? v.getRentalPrice() : BigDecimal.ZERO)
                    .actualEvents(actualEvents)
                    .availableShifts(availableShifts)
                    .occupancyRate(occupancyRate)
                    .totalRevenue(revenue)
                    .build();
            items.add(item);
        }

        // Sort items: totalRevenue DESC, occupancyRate DESC, venueName ASC (stable tie-breaker)
        items.sort(Comparator.comparing(VenueOccupancyItemDto::getTotalRevenue, Comparator.reverseOrder())
                .thenComparing(VenueOccupancyItemDto::getOccupancyRate, Comparator.reverseOrder())
                .thenComparing(VenueOccupancyItemDto::getVenueName));

        // Assign rank
        for (int i = 0; i < items.size(); i++) {
            items.get(i).setRank(i + 1);
        }

        // Summary calculations
        long sumEvents = items.stream().mapToLong(VenueOccupancyItemDto::getActualEvents).sum();
        BigDecimal sumRevenue = items.stream()
                .map(VenueOccupancyItemDto::getTotalRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgOccupancy = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        if (!items.isEmpty()) {
            avgOccupancy = items.stream()
                    .map(VenueOccupancyItemDto::getOccupancyRate)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(items.size()), 2, RoundingMode.HALF_UP);
        }

        return VenueOccupancyReportResponse.builder()
                .startDate(startDate)
                .endDate(endDate)
                .totalDays(totalDays)
                .totalVenues(items.size())
                .totalEvents(sumEvents)
                .totalRevenue(sumRevenue)
                .averageOccupancyRate(avgOccupancy)
                .items(items)
                .build();
    }
}
