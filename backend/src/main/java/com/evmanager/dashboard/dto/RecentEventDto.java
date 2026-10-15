package com.evmanager.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentEventDto {
    private Long id;
    private String title;
    private String client;
    private String type;
    private OffsetDateTime date;
    private String location;
    private BigDecimal budget;
    private String status;
}
