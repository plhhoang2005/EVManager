package com.evmanager.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Health Check", description = "Endpoint kiểm tra trạng thái hoạt động của hệ thống")
@SecurityRequirements()
public class HealthCheckController {

    @GetMapping("/health")
    @Operation(summary = "Kiểm tra sức khỏe hệ thống Backend", description = "Trả về trạng thái hoạt động của dịch vụ")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }
}
