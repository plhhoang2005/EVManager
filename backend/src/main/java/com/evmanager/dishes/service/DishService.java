package com.evmanager.dishes.service;

import com.evmanager.dishes.dto.DishResponse;
import com.evmanager.dishes.model.Dish;
import com.evmanager.dishes.model.DishStatus;
import com.evmanager.dishes.repository.DishRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DishService {

    private final DishRepository dishRepository;

    public DishService(DishRepository dishRepository) {
        this.dishRepository = dishRepository;
    }

    @Transactional(readOnly = true)
    public Page<DishResponse> getDishes(String category, Pageable pageable) {
        Page<Dish> dishes;
        if (category != null && !category.trim().isEmpty()) {
            dishes = dishRepository.findByCategoryAndStatus(category, DishStatus.ACTIVE, pageable);
        } else {
            dishes = dishRepository.findByStatus(DishStatus.ACTIVE, pageable);
        }
        return dishes.map(this::mapToResponse);
    }

    private DishResponse mapToResponse(Dish dish) {
        return DishResponse.builder()
                .dishId(dish.getDishId())
                .dishName(dish.getDishName())
                .category(dish.getCategory())
                .price(dish.getPrice())
                .description(dish.getDescription())
                .status(dish.getStatus())
                .createdAt(dish.getCreatedAt())
                .updatedAt(dish.getUpdatedAt())
                .build();
    }
}
