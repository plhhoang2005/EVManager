package com.evmanager.menus.service;

import com.evmanager.dishes.model.Dish;
import com.evmanager.dishes.model.DishStatus;
import com.evmanager.dishes.repository.DishRepository;
import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.menus.dto.MenuDishRequest;
import com.evmanager.menus.dto.MenuDishResponse;
import com.evmanager.menus.dto.MenuRequest;
import com.evmanager.menus.dto.MenuResponse;
import com.evmanager.menus.model.Menu;
import com.evmanager.menus.model.MenuDish;
import com.evmanager.menus.model.MenuDishId;
import com.evmanager.menus.model.MenuStatus;
import com.evmanager.menus.repository.MenuRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuService {

    private final MenuRepository menuRepository;
    private final DishRepository dishRepository;

    public MenuService(MenuRepository menuRepository, DishRepository dishRepository) {
        this.menuRepository = menuRepository;
        this.dishRepository = dishRepository;
    }

    @Transactional
    public MenuResponse createMenu(MenuRequest request) {
        if (menuRepository.findByMenuName(request.getMenuName()).isPresent()) {
            throw new ResourceConflictException("Menu name already exists");
        }

        Menu menu = new Menu();
        menu.setMenuName(request.getMenuName());
        menu.setDescription(request.getDescription());
        menu.setPrice(request.getPrice());
        menu.setStatus(MenuStatus.ACTIVE);

        for (MenuDishRequest mdr : request.getDishes()) {
            Dish dish = dishRepository.findById(mdr.getDishId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dish not found with id: " + mdr.getDishId()));

            if (dish.getStatus() == DishStatus.INACTIVE) {
                throw new ResourceConflictException("Cannot add inactive dish to menu: " + dish.getDishName());
            }

            MenuDish menuDish = new MenuDish();
            menuDish.getId().setDishId(dish.getDishId());
            // menuId will be set after menu is saved, but JPA cascading handles the relation if we set the entities
            menuDish.setMenu(menu);
            menuDish.setDish(dish);
            menuDish.setQuantity(mdr.getQuantity());
            menuDish.setNote(mdr.getNote());

            menu.getMenuDishes().add(menuDish);
        }

        Menu savedMenu = menuRepository.save(menu);
        return mapToResponse(savedMenu);
    }

    @Transactional(readOnly = true)
    public MenuResponse getMenuById(Long id) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));
        return mapToResponse(menu);
    }

    private MenuResponse mapToResponse(Menu menu) {
        List<MenuDishResponse> dishResponses = menu.getMenuDishes().stream()
                .map(md -> MenuDishResponse.builder()
                        .dishId(md.getDish().getDishId())
                        .dishName(md.getDish().getDishName())
                        .category(md.getDish().getCategory())
                        .quantity(md.getQuantity())
                        .note(md.getNote())
                        .build())
                .collect(Collectors.toList());

        return MenuResponse.builder()
                .menuId(menu.getMenuId())
                .menuName(menu.getMenuName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .status(menu.getStatus())
                .dishes(dishResponses)
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
    }
}
