package com.evmanager.dishes.dto;

import com.evmanager.dishes.model.DishStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Builder
public class DishResponse {
    private Long dishId;
    private String dishName;
    private String category;
    private BigDecimal price;
    private String description;
    private DishStatus status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
