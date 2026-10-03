package com.evmanager.menus.controller;

import com.evmanager.menus.dto.MenuRequest;
import com.evmanager.menus.dto.MenuResponse;
import com.evmanager.menus.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/menus")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuResponse> createMenu(@Valid @RequestBody MenuRequest request) {
        MenuResponse response = menuService.createMenu(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SALES', 'COORDINATOR', 'CUSTOMER')")
    public ResponseEntity<MenuResponse> getMenuById(@PathVariable Long id) {
        MenuResponse response = menuService.getMenuById(id);
        return ResponseEntity.ok(response);
    }
}
