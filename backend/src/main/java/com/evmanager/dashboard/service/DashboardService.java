package com.evmanager.dashboard.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.dashboard.dto.*;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final ZoneId ZONE_VN = ZoneId.of("Asia/Ho_Chi_Minh");

    private final ContractRepository contractRepository;
    private final EventRepository eventRepository;
    private final CustomerRepository customerRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardStats(Integer year, Integer month) {
        LocalDate today = LocalDate.now(ZONE_VN);
        int targetYear = (year != null && year >= 1900) ? year : today.getYear();
        int targetMonth = (month != null && month >= 1 && month <= 12) ? month : today.getMonthValue();

        // 1. Doanh thu tháng hiện tại
        YearMonth currentYm = YearMonth.of(targetYear, targetMonth);
        LocalDate startCurrent = currentYm.atDay(1);
        LocalDate endCurrent = currentYm.atEndOfMonth();
        BigDecimal currentRevenue = contractRepository.sumRevenueBetweenDates(startCurrent, endCurrent);
        if (currentRevenue == null) {
            currentRevenue = BigDecimal.ZERO;
        }

        // 2. Doanh thu tháng trước & Tỷ lệ tăng trưởng MoM
        YearMonth prevYm = currentYm.minusMonths(1);
        LocalDate startPrev = prevYm.atDay(1);
        LocalDate endPrev = prevYm.atEndOfMonth();
        BigDecimal prevRevenue = contractRepository.sumRevenueBetweenDates(startPrev, endPrev);
        if (prevRevenue == null) {
            prevRevenue = BigDecimal.ZERO;
        }

        BigDecimal growthRate = null;
        if (prevRevenue.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal diff = currentRevenue.subtract(prevRevenue);
            growthRate = diff.multiply(BigDecimal.valueOf(100))
                    .divide(prevRevenue, 2, RoundingMode.HALF_UP);
        }

        // 3. Chuỗi 12 tháng doanh thu trong năm
        LocalDate startOfYear = LocalDate.of(targetYear, 1, 1);
        LocalDate endOfYear = LocalDate.of(targetYear, 12, 31);
        List<Object[]> rawAgg = contractRepository.aggregateMonthlyRevenue(startOfYear, endOfYear);

        List<BigDecimal> monthlyRevenue = new ArrayList<>(12);
        List<MonthlyRevenueDto> monthlyDetails = new ArrayList<>(12);
        for (int m = 1; m <= 12; m++) {
            monthlyRevenue.add(BigDecimal.ZERO);
            monthlyDetails.add(new MonthlyRevenueDto(m, targetYear, BigDecimal.ZERO));
        }

        if (rawAgg != null) {
            for (Object[] row : rawAgg) {
                if (row != null && row.length >= 2 && row[0] != null && row[1] != null) {
                    int m = ((Number) row[0]).intValue();
                    BigDecimal rev = row[1] instanceof BigDecimal
                            ? (BigDecimal) row[1]
                            : new BigDecimal(row[1].toString());
                    if (m >= 1 && m <= 12) {
                        monthlyRevenue.set(m - 1, rev);
                        monthlyDetails.get(m - 1).setRevenue(rev);
                    }
                }
            }
        }

        // 4. Thống kê 4 nhóm trạng thái hợp đồng
        ContractStatusStatsDto statusStats = ContractStatusStatsDto.builder()
                .daCoc(contractRepository.countDaCoc())
                .dangTiec(contractRepository.countDangTiec())
                .daThanhLy(contractRepository.countDaThanhLy())
                .daHuy(contractRepository.countDaHuy())
                .build();

        // 5. Các thẻ KPI tổng thể
        long totalEvents = eventRepository.count();
        long totalCustomers = customerRepository.count();
        long pendingContracts = contractRepository.countPendingContracts();

        // 6. Danh sách sự kiện gần nhất (top 4 cho Frontend)
        Pageable pageable = PageRequest.of(0, 4, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Event> recentEventsList = eventRepository.findAll(pageable).getContent();
        List<RecentEventDto> recentDtos = recentEventsList.stream().map(e -> {
            String clientName = "Khách hàng";
            BigDecimal budget = BigDecimal.ZERO;
            Optional<Contract> optContract = contractRepository.findByEvent_EventId(e.getEventId());
            if (optContract.isPresent()) {
                Contract c = optContract.get();
                if (c.getCustomer() != null && c.getCustomer().getFullName() != null) {
                    clientName = c.getCustomer().getFullName();
                }
                if (c.getTotalAmount() != null) {
                    budget = c.getTotalAmount();
                }
            }
            String locationName = e.getVenue() != null ? e.getVenue().getVenueName() : "Sảnh";
            String displayStatus = "SCHEDULED".equals(e.getStatus()) ? "Đã xác nhận" :
                    "PREPARING".equals(e.getStatus()) ? "Đang chuẩn bị" :
                    "IN_PROGRESS".equals(e.getStatus()) ? "Đang tiệc" :
                    "COMPLETED".equals(e.getStatus()) ? "Hoàn thành" : e.getStatus();

            return RecentEventDto.builder()
                    .id(e.getEventId())
                    .title(e.getEventName())
                    .client(clientName)
                    .type("Tiệc cưới / Sự kiện")
                    .date(e.getStartAt())
                    .location(locationName)
                    .budget(budget)
                    .status(displayStatus)
                    .build();
        }).collect(Collectors.toList());

        return DashboardSummaryResponse.builder()
                .totalRevenue(currentRevenue)
                .growthRate(growthRate)
                .totalEvents(totalEvents)
                .totalCustomers(totalCustomers)
                .pendingContracts(pendingContracts)
                .monthlyRevenue(monthlyRevenue)
                .monthlyDetails(monthlyDetails)
                .contractsByStatus(statusStats)
                .recentEvents(recentDtos)
                .build();
    }
}
