package com.evmanager.reports.service;

import com.evmanager.events.repository.EventRepository;
import com.evmanager.reports.dto.VenueOccupancyItemDto;
import com.evmanager.reports.dto.VenueOccupancyReportResponse;
import com.evmanager.venues.model.Venue;
import com.evmanager.venues.repository.VenueRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private VenueRepository venueRepository;

    @InjectMocks
    private ReportService reportService;

    private Venue venue1;
    private Venue venue2;
    private Venue venue3;
    private Venue venueInactive;

    @BeforeEach
    void setUp() {
        venue1 = new Venue();
        venue1.setVenueId(1L);
        venue1.setVenueName("Sảnh Kim Cương");
        venue1.setMaxCapacity(500);
        venue1.setRentalPrice(new BigDecimal("20000000.00"));
        venue1.setStatus("AVAILABLE");

        venue2 = new Venue();
        venue2.setVenueId(2L);
        venue2.setVenueName("Sảnh Vàng");
        venue2.setMaxCapacity(350);
        venue2.setRentalPrice(new BigDecimal("15000000.00"));
        venue2.setStatus("AVAILABLE");

        venue3 = new Venue();
        venue3.setVenueId(3L);
        venue3.setVenueName("Sảnh Ruby");
        venue3.setMaxCapacity(200);
        venue3.setRentalPrice(new BigDecimal("10000000.00"));
        venue3.setStatus("AVAILABLE");

        venueInactive = new Venue();
        venueInactive.setVenueId(4L);
        venueInactive.setVenueName("Sảnh Đang Sửa");
        venueInactive.setMaxCapacity(100);
        venueInactive.setRentalPrice(new BigDecimal("5000000.00"));
        venueInactive.setStatus("INACTIVE");
    }

    @Test
    @DisplayName("BE-23: Tính đúng số ca khả dụng (2 ca/ngày), tỷ lệ lấp đầy và xếp hạng theo doanh thu giảm dần")
    void testGetVenueOccupancyReport_Normal() {
        // Range 2026-10-01 to 2026-10-31: 31 days -> 62 available shifts per active venue
        LocalDate start = LocalDate.of(2026, 10, 1);
        LocalDate end = LocalDate.of(2026, 10, 31);

        when(venueRepository.findAll()).thenReturn(List.of(venue1, venue2, venue3));

        List<Object[]> rawAgg = new ArrayList<>();
        // venue1: 15 events, 300,000,000 revenue -> occupancy = 15/62 * 100 = 24.19%
        rawAgg.add(new Object[]{1L, 15L, new BigDecimal("300000000.00")});
        // venue2: 20 events, 500,000,000 revenue -> occupancy = 20/62 * 100 = 32.26%
        rawAgg.add(new Object[]{2L, 20L, new BigDecimal("500000000.00")});
        // venue3 has 0 events -> occupancy = 0.00%, revenue = 0
        when(eventRepository.aggregateVenueOccupancyAndRevenue(any(), any())).thenReturn(rawAgg);

        VenueOccupancyReportResponse response = reportService.getVenueOccupancyReport(start, end);

        assertNotNull(response);
        assertEquals(31L, response.getTotalDays());
        assertEquals(3, response.getTotalVenues());
        assertEquals(35L, response.getTotalEvents()); // 15 + 20
        assertEquals(new BigDecimal("800000000.00"), response.getTotalRevenue());

        List<VenueOccupancyItemDto> items = response.getItems();
        assertEquals(3, items.size());

        // Rank 1: Venue 2 (Highest revenue 500tr)
        assertEquals(1, items.get(0).getRank());
        assertEquals(2L, items.get(0).getVenueId());
        assertEquals("Sảnh Vàng", items.get(0).getVenueName());
        assertEquals(new BigDecimal("500000000.00"), items.get(0).getTotalRevenue());
        assertEquals(62L, items.get(0).getAvailableShifts());
        assertEquals(20L, items.get(0).getActualEvents());
        assertEquals(new BigDecimal("32.26"), items.get(0).getOccupancyRate());

        // Rank 2: Venue 1 (300tr)
        assertEquals(2, items.get(1).getRank());
        assertEquals(1L, items.get(1).getVenueId());
        assertEquals(new BigDecimal("300000000.00"), items.get(1).getTotalRevenue());
        assertEquals(new BigDecimal("24.19"), items.get(1).getOccupancyRate());

        // Rank 3: Venue 3 (0tr, 0 events)
        assertEquals(3, items.get(2).getRank());
        assertEquals(3L, items.get(2).getVenueId());
        assertEquals(BigDecimal.ZERO, items.get(2).getTotalRevenue());
        assertEquals(0L, items.get(2).getActualEvents());
        assertEquals(new BigDecimal("0.00"), items.get(2).getOccupancyRate());
    }

    @Test
    @DisplayName("BE-23: Khoảng thời gian đúng 1 ngày (startDate == endDate) -> Có 2 ca khả dụng")
    void testSingleDayRange() {
        LocalDate date = LocalDate.of(2026, 10, 15);
        when(venueRepository.findAll()).thenReturn(List.of(venue1));

        List<Object[]> rawAgg = new ArrayList<>();
        // 1 event on this day -> occupancy = 1/2 * 100 = 50.00%
        rawAgg.add(new Object[]{1L, 1L, new BigDecimal("25000000.00")});
        when(eventRepository.aggregateVenueOccupancyAndRevenue(any(), any())).thenReturn(rawAgg);

        VenueOccupancyReportResponse response = reportService.getVenueOccupancyReport(date, date);

        assertEquals(1L, response.getTotalDays());
        assertEquals(1, response.getItems().size());
        assertEquals(2L, response.getItems().get(0).getAvailableShifts());
        assertEquals(1L, response.getItems().get(0).getActualEvents());
        assertEquals(new BigDecimal("50.00"), response.getItems().get(0).getOccupancyRate());
    }

    @Test
    @DisplayName("BE-23: Sảnh INACTIVE -> availableShifts = 0, occupancyRate = 0.00 (không chia cho 0)")
    void testInactiveVenue_AvailableShiftsZero() {
        LocalDate start = LocalDate.of(2026, 10, 1);
        LocalDate end = LocalDate.of(2026, 10, 10); // 10 days

        when(venueRepository.findAll()).thenReturn(List.of(venueInactive));
        when(eventRepository.aggregateVenueOccupancyAndRevenue(any(), any())).thenReturn(Collections.emptyList());

        VenueOccupancyReportResponse response = reportService.getVenueOccupancyReport(start, end);

        assertEquals(1, response.getItems().size());
        assertEquals(0L, response.getItems().get(0).getAvailableShifts());
        assertEquals(new BigDecimal("0.00"), response.getItems().get(0).getOccupancyRate());
    }

    @Test
    @DisplayName("BE-23: Validation: startDate sau endDate -> Ném IllegalArgumentException")
    void testValidation_StartDateAfterEndDate() {
        LocalDate start = LocalDate.of(2026, 10, 31);
        LocalDate end = LocalDate.of(2026, 10, 1);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                reportService.getVenueOccupancyReport(start, end));
        assertTrue(ex.getMessage().contains("cannot be after"));
    }

    @Test
    @DisplayName("BE-23: Validation: startDate hoặc endDate null -> Ném IllegalArgumentException")
    void testValidation_NullDate() {
        assertThrows(IllegalArgumentException.class, () ->
                reportService.getVenueOccupancyReport(null, LocalDate.now()));
        assertThrows(IllegalArgumentException.class, () ->
                reportService.getVenueOccupancyReport(LocalDate.now(), null));
    }

    @Test
    @DisplayName("BE-23: Tie-breaker khi doanh thu bằng nhau -> Sắp xếp theo Occupancy DESC, rồi Tên sảnh ASC")
    void testTieBreaker_EqualRevenue() {
        LocalDate start = LocalDate.of(2026, 10, 1);
        LocalDate end = LocalDate.of(2026, 10, 31);

        when(venueRepository.findAll()).thenReturn(List.of(venue1, venue2, venue3));

        List<Object[]> rawAgg = new ArrayList<>();
        // venue1: 10 events, 100tr revenue -> rate = 10/62 * 100 = 16.13%
        rawAgg.add(new Object[]{1L, 10L, new BigDecimal("100000000.00")});
        // venue2: 12 events, 100tr revenue -> rate = 12/62 * 100 = 19.35%
        rawAgg.add(new Object[]{2L, 12L, new BigDecimal("100000000.00")});
        // venue3: 5 events, 100tr revenue -> rate = 5/62 * 100 = 8.06%
        rawAgg.add(new Object[]{3L, 5L, new BigDecimal("100000000.00")});

        when(eventRepository.aggregateVenueOccupancyAndRevenue(any(), any())).thenReturn(rawAgg);

        VenueOccupancyReportResponse response = reportService.getVenueOccupancyReport(start, end);

        List<VenueOccupancyItemDto> items = response.getItems();
        // Since revenues are equal (100tr), sorted by Occupancy DESC:
        // Rank 1: venue2 (19.35%)
        assertEquals(2L, items.get(0).getVenueId());
        assertEquals(1, items.get(0).getRank());
        // Rank 2: venue1 (16.13%)
        assertEquals(1L, items.get(1).getVenueId());
        assertEquals(2, items.get(1).getRank());
        // Rank 3: venue3 (8.06%)
        assertEquals(3L, items.get(2).getVenueId());
        assertEquals(3, items.get(2).getRank());
    }

    @Test
    @DisplayName("BE-23: Không có sảnh nào trong cơ sở dữ liệu -> Trả danh sách rỗng an toàn")
    void testNoVenues() {
        when(venueRepository.findAll()).thenReturn(Collections.emptyList());
        when(eventRepository.aggregateVenueOccupancyAndRevenue(any(), any())).thenReturn(Collections.emptyList());

        VenueOccupancyReportResponse response = reportService.getVenueOccupancyReport(
                LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 31));

        assertNotNull(response);
        assertEquals(0, response.getTotalVenues());
        assertEquals(0L, response.getTotalEvents());
        assertEquals(BigDecimal.ZERO, response.getTotalRevenue());
        assertEquals(new BigDecimal("0.00"), response.getAverageOccupancyRate());
        assertTrue(response.getItems().isEmpty());
    }
}
