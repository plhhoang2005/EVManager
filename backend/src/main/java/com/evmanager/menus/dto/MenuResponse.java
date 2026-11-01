package com.evmanager.menus.dto;

import com.evmanager.menus.model.MenuStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
public class MenuResponse {
    private Long menuId;
    private String menuName;
    private String description;
    private BigDecimal price;
    private MenuStatus status;
    private List<MenuDishResponse> dishes;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
