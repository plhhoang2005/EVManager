package com.evmanager.dashboard.service;

import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.dashboard.dto.DashboardSummaryResponse;
import com.evmanager.events.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private ContractRepository contractRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @BeforeEach
    void setUp() {
        when(eventRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(Collections.emptyList()));
        when(eventRepository.count()).thenReturn(10L);
        when(customerRepository.count()).thenReturn(25L);
        when(contractRepository.countPendingContracts()).thenReturn(3L);
        when(contractRepository.countDaCoc()).thenReturn(5L);
        when(contractRepository.countDangTiec()).thenReturn(2L);
        when(contractRepository.countDaThanhLy()).thenReturn(8L);
        when(contractRepository.countDaHuy()).thenReturn(1L);
    }

    @Test
    @DisplayName("DASH-02 & DASH-03: Tính đúng doanh thu tháng và tỷ lệ tăng trưởng dương khi tháng trước > 0")
    void testRevenueAndPositiveGrowthRate() {
        // Current month: 120,000,000; Previous month: 100,000,000 -> Growth: +20.00%
        when(contractRepository.sumRevenueBetweenDates(LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 31)))
                .thenReturn(new BigDecimal("120000000.00"));
        when(contractRepository.sumRevenueBetweenDates(LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30)))
                .thenReturn(new BigDecimal("100000000.00"));

        DashboardSummaryResponse response = dashboardService.getDashboardStats(2026, 10);

        assertNotNull(response);
        assertEquals(new BigDecimal("120000000.00"), response.getTotalRevenue());
        assertNotNull(response.getGrowthRate(), "Growth rate không được null khi tháng trước > 0");
        assertEquals(new BigDecimal("20.00"), response.getGrowthRate());
    }

    @Test
    @DisplayName("DASH-04 (Gate E): Khi tháng trước bằng 0, growthRate phải là null theo phê duyệt E1")
    void testGrowthRate_WhenPreviousMonthIsZero_ReturnsNull() {
        when(contractRepository.sumRevenueBetweenDates(LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 31)))
                .thenReturn(new BigDecimal("80000000.00"));
        when(contractRepository.sumRevenueBetweenDates(LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30)))
                .thenReturn(BigDecimal.ZERO);

        DashboardSummaryResponse response = dashboardService.getDashboardStats(2026, 10);

        assertNotNull(response);
        assertEquals(new BigDecimal("80000000.00"), response.getTotalRevenue());
        assertNull(response.getGrowthRate(), "Khi tháng trước = 0, growthRate phải là null (không chia cho 0)");
    }

    @Test
    @DisplayName("DASH-03-B: Doanh thu tháng này bằng 0 trong khi tháng trước dương -> Giảm -100.00%")
    void testGrowthRate_WhenCurrentZeroAndPreviousPositive() {
        when(contractRepository.sumRevenueBetweenDates(LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 31)))
                .thenReturn(BigDecimal.ZERO);
        when(contractRepository.sumRevenueBetweenDates(LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30)))
                .thenReturn(new BigDecimal("50000000.00"));

        DashboardSummaryResponse response = dashboardService.getDashboardStats(2026, 10);

        assertNotNull(response);
        assertEquals(BigDecimal.ZERO, response.getTotalRevenue());
        assertNotNull(response.getGrowthRate());
        assertEquals(new BigDecimal("-100.00"), response.getGrowthRate());
    }

    @Test
    @DisplayName("DASH-05: Hệ thống rỗng không có dữ liệu -> An toàn, không văng lỗi, doanh thu = 0, growthRate = null")
    void testEmptyDatabase() {
        when(contractRepository.sumRevenueBetweenDates(any(), any())).thenReturn(null);
        when(contractRepository.aggregateMonthlyRevenue(any(), any())).thenReturn(Collections.emptyList());

        DashboardSummaryResponse response = dashboardService.getDashboardStats(2026, 5);

        assertNotNull(response);
        assertEquals(BigDecimal.ZERO, response.getTotalRevenue());
        assertNull(response.getGrowthRate());
        assertNotNull(response.getMonthlyRevenue());
        assertEquals(12, response.getMonthlyRevenue().size());
        for (BigDecimal mRev : response.getMonthlyRevenue()) {
            assertEquals(BigDecimal.ZERO, mRev);
        }
    }

    @Test
    @DisplayName("DASH-06: Chuỗi 12 tháng luôn đủ 12 phần tử, tháng không có doanh thu được gán 0 VNĐ")
    void testMonthlyRevenue_AlwaysReturns12Months() {
        List<Object[]> mockAgg = new ArrayList<>();
        mockAgg.add(new Object[]{2, new BigDecimal("45000000.00")}); // Tháng 2
        mockAgg.add(new Object[]{8, new BigDecimal("95000000.00")}); // Tháng 8

        when(contractRepository.aggregateMonthlyRevenue(LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31)))
                .thenReturn(mockAgg);

        DashboardSummaryResponse response = dashboardService.getDashboardStats(2026, 10);

        assertNotNull(response.getMonthlyRevenue());
        assertEquals(12, response.getMonthlyRevenue().size());

        // Tháng 1 = 0
        assertEquals(BigDecimal.ZERO, response.getMonthlyRevenue().get(0));
        // Tháng 2 = 45tr
        assertEquals(new BigDecimal("45000000.00"), response.getMonthlyRevenue().get(1));
        // Tháng 3 đến 7 = 0
        assertEquals(BigDecimal.ZERO, response.getMonthlyRevenue().get(2));
        assertEquals(BigDecimal.ZERO, response.getMonthlyRevenue().get(6));
        // Tháng 8 = 95tr
        assertEquals(new BigDecimal("95000000.00"), response.getMonthlyRevenue().get(7));
        // Tháng 12 = 0
        assertEquals(BigDecimal.ZERO, response.getMonthlyRevenue().get(11));
    }

    @Test
    @DisplayName("DASH-09 & DASH-10: Thống kê chính xác 4 nhóm trạng thái hợp đồng và pendingContracts")
    void testContractStatusGroups() {
        DashboardSummaryResponse response = dashboardService.getDashboardStats(2026, 10);

        assertNotNull(response.getContractsByStatus());
        assertEquals(5L, response.getContractsByStatus().getDaCoc());
        assertEquals(2L, response.getContractsByStatus().getDangTiec());
        assertEquals(8L, response.getContractsByStatus().getDaThanhLy());
        assertEquals(1L, response.getContractsByStatus().getDaHuy());
        assertEquals(3L, response.getPendingContracts());
        assertEquals(10L, response.getTotalEvents());
        assertEquals(25L, response.getTotalCustomers());
    }

    @Test
    @DisplayName("DASH-08: Độ chính xác số học với số tiền lớn hàng tỷ VNĐ và làm tròn HALF_UP")
    void testLargeAmountBigDecimalPrecision() {
        BigDecimal current = new BigDecimal("4875320500.00");
        BigDecimal prev = new BigDecimal("3250100200.00");

        when(contractRepository.sumRevenueBetweenDates(LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 31)))
                .thenReturn(current);
        when(contractRepository.sumRevenueBetweenDates(LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 30)))
                .thenReturn(prev);

        DashboardSummaryResponse response = dashboardService.getDashboardStats(2026, 10);

        assertEquals(current, response.getTotalRevenue());
        // diff = 1625220300.00
        // growth = 1625220300 * 100 / 3250100200 = 50.0052... -> 50.01%
        assertNotNull(response.getGrowthRate());
        assertEquals(new BigDecimal("50.01"), response.getGrowthRate());
    }
}
