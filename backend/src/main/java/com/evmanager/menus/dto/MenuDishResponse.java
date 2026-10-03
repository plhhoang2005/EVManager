package com.evmanager.menus.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MenuDishResponse {
    private Long dishId;
    private String dishName;
    private String category;
    private Integer quantity;
    private String note;
}
