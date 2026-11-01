package com.evmanager.dishes.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class DishRequest {

    @NotBlank(message = "Dish name is required")
    @Size(max = 100, message = "Dish name cannot exceed 100 characters")
    private String dishName;

    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category cannot exceed 50 characters")
    private String category;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private BigDecimal price;

    private String description;
    
    private com.evmanager.dishes.model.DishStatus status;
}
