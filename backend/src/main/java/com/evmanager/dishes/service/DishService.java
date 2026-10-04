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

    @Transactional
    public DishResponse createDish(com.evmanager.dishes.dto.DishRequest request) {
        if (dishRepository.findByDishNameAndCategory(request.getDishName(), request.getCategory()).isPresent()) {
            throw new com.evmanager.exception.ResourceConflictException("Dish already exists in this category");
        }
        Dish dish = new Dish();
        dish.setDishName(request.getDishName());
        dish.setCategory(request.getCategory());
        dish.setPrice(request.getPrice());
        dish.setDescription(request.getDescription());
        dish.setStatus(DishStatus.ACTIVE);
        return mapToResponse(dishRepository.save(dish));
    }

    @Transactional
    public DishResponse updateDish(Long id, com.evmanager.dishes.dto.DishRequest request) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new com.evmanager.exception.ResourceNotFoundException("Dish not found: " + id));
        
        dishRepository.findByDishNameAndCategory(request.getDishName(), request.getCategory())
                .ifPresent(existing -> {
                    if (!existing.getDishId().equals(id)) {
                        throw new com.evmanager.exception.ResourceConflictException("Dish already exists in this category");
                    }
                });

        dish.setDishName(request.getDishName());
        dish.setCategory(request.getCategory());
        dish.setPrice(request.getPrice());
        dish.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            dish.setStatus(request.getStatus());
        }
        return mapToResponse(dishRepository.save(dish));
    }

    @Transactional
    public void deleteDish(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new com.evmanager.exception.ResourceNotFoundException("Dish not found: " + id));
        dish.setStatus(DishStatus.INACTIVE);
        dishRepository.save(dish);
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
