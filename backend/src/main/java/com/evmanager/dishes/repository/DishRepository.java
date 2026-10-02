package com.evmanager.dishes.repository;

import com.evmanager.dishes.model.Dish;
import com.evmanager.dishes.model.DishStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    Page<Dish> findByCategoryAndStatus(String category, DishStatus status, Pageable pageable);
    Page<Dish> findByStatus(DishStatus status, Pageable pageable);
}
