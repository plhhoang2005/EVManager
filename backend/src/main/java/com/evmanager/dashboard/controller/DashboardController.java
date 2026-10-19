package com.evmanager.dashboard.controller;

import com.evmanager.dashboard.dto.DashboardSummaryResponse;
import com.evmanager.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping(value = {"/api/dashboard/stats", "/api/v1/dashboard/summary"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardSummaryResponse> getDashboardStats(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        DashboardSummaryResponse response = dashboardService.getDashboardStats(year, month);
        return ResponseEntity.ok(response);
    }
}
