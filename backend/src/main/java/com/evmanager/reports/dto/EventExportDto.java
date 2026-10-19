package com.evmanager.reports.dto;

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
public class EventExportDto {
    private Long eventId;
    private String contractCode;
    private String eventName;
    private String customerName;
    private String venueName;
    private OffsetDateTime startAt;
    private BigDecimal totalAmount;
    private String status;
}
