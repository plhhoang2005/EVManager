package com.evmanager.venues.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VenueUpdateRequest {

    private String venueName;
    private String address;

    @Min(value = 0, message = "Min capacity must be non-negative")
    private Integer minCapacity;

    @Min(value = 0, message = "Max capacity must be non-negative")
    private Integer maxCapacity;

    @Min(value = 0, message = "Rental price must be non-negative")
    private BigDecimal rentalPrice;

    @Pattern(regexp = "^(AVAILABLE|MAINTENANCE|INACTIVE)$", message = "Status must be AVAILABLE, MAINTENANCE or INACTIVE")
    private String status;
}
