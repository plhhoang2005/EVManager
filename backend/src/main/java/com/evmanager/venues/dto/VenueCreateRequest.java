package com.evmanager.venues.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VenueCreateRequest {

    @NotBlank(message = "Venue name is required")
    private String venueName;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Min capacity is required")
    @Min(value = 0, message = "Min capacity must be non-negative")
    private Integer minCapacity;

    @NotNull(message = "Max capacity is required")
    @Min(value = 0, message = "Max capacity must be non-negative")
    private Integer maxCapacity;

    @NotNull(message = "Rental price is required")
    @Min(value = 0, message = "Rental price must be non-negative")
    private BigDecimal rentalPrice;
}
