package com.evmanager.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VenueOccupancyItemDto {
    private Integer rank;
    private Long venueId;
    private String venueName;
    private Integer capacity;
    private String status;
    private BigDecimal rentalPrice;
    private Long actualEvents;
    private Long availableShifts;
    private BigDecimal occupancyRate;
    private BigDecimal totalRevenue;
}
