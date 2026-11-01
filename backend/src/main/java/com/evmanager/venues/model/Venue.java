package com.evmanager.venues.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "venues")
@Getter
@Setter
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "venue_id")
    private Long venueId;

    @Column(name = "venue_name", nullable = false, length = 100)
    private String venueName;

    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @Column(name = "min_capacity", nullable = false)
    private Integer minCapacity = 0;

    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity;

    @Column(name = "rental_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal rentalPrice;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "AVAILABLE";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
