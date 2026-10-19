package com.evmanager.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VenueOccupancyReportResponse {
    private LocalDate startDate;
    private LocalDate endDate;
    private Long totalDays;
    private Integer totalVenues;
    private Long totalEvents;
    private BigDecimal totalRevenue;
    private BigDecimal averageOccupancyRate;
    private List<VenueOccupancyItemDto> items;
}
