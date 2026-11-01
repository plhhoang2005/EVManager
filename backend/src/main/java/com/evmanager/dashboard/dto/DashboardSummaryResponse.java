package com.evmanager.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long totalEvents;
    private long activeEvents;
    private long totalCustomers;
    private long totalContracts;
    private long pendingContracts;
    private BigDecimal totalRevenue;
    private BigDecimal totalDeposits;
    private long availableVenues;
    private List<BigDecimal> monthlyRevenue;
    private List<RecentEventDto> recentEvents;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentEventDto {
        private Long eventId;
        private String eventName;
        private String venueName;
        private String startAt;
        private int guestCount;
        private String status;
    }
}
