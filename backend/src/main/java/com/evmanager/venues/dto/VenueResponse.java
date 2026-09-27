package com.evmanager.venues.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
public class VenueResponse {
    private Long venueId;
    private String venueName;
    private String address;
    private Integer minCapacity;
    private Integer maxCapacity;
    private BigDecimal rentalPrice;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
