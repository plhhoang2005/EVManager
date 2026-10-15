package com.evmanager.reports.controller;

import com.evmanager.reports.dto.VenueOccupancyReportResponse;
import com.evmanager.reports.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportsController {

    private final ReportService reportService;

    @GetMapping("/venue-occupancy")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VenueOccupancyReportResponse> getVenueOccupancyReport(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        VenueOccupancyReportResponse response = reportService.getVenueOccupancyReport(startDate, endDate);
        return ResponseEntity.ok(response);
    }
}
