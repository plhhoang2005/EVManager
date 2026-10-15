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

    // Issue #119: Doanh thu tháng hiện tại và tăng trưởng
    private BigDecimal totalRevenue;
    private BigDecimal growthRate;

    // Frontend KPI cards & Issue #119
    private Long totalEvents;
    private Long totalCustomers;
    private Long pendingContracts;

    // Issue #119: Chuỗi 12 tháng doanh thu
    private List<BigDecimal> monthlyRevenue;
    private List<MonthlyRevenueDto> monthlyDetails;

    // Issue #119: Thống kê 4 nhóm trạng thái hợp đồng
    private ContractStatusStatsDto contractsByStatus;

    // Frontend recent events table support
    private List<RecentEventDto> recentEvents;
}
