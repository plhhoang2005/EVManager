package com.evmanager.menus.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class MenuRequest {

    @NotBlank(message = "Menu name is required")
    @Size(max = 100, message = "Menu name cannot exceed 100 characters")
    private String menuName;

    private String description;

    @NotNull(message = "Table price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private BigDecimal price;

    @NotNull(message = "Dish list is required")
    @Size(min = 1, message = "Menu must have at least one dish")
    @Valid
    private List<MenuDishRequest> dishes;
    
    private com.evmanager.menus.model.MenuStatus status;
}
