package com.evmanager.menus.service;

import com.evmanager.dishes.model.Dish;
import com.evmanager.dishes.model.DishStatus;
import com.evmanager.dishes.repository.DishRepository;
import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.menus.dto.MenuDishRequest;
import com.evmanager.menus.dto.MenuRequest;
import com.evmanager.menus.dto.MenuResponse;
import com.evmanager.menus.model.Menu;
import com.evmanager.menus.repository.MenuRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MenuServiceTest {

    @Mock
    private MenuRepository menuRepository;

    @Mock
    private DishRepository dishRepository;

    @InjectMocks
    private MenuService menuService;

    private MenuRequest validRequest;
    private Dish activeDish;

    @BeforeEach
    void setUp() {
        MenuDishRequest mdr = new MenuDishRequest();
        mdr.setDishId(1L);
        mdr.setQuantity(2);

        validRequest = new MenuRequest();
        validRequest.setMenuName("Wedding Menu 1");
        validRequest.setPrice(BigDecimal.valueOf(5000000));
        validRequest.setDishes(List.of(mdr));

        activeDish = new Dish();
        activeDish.setDishId(1L);
        activeDish.setDishName("Soup");
        activeDish.setStatus(DishStatus.ACTIVE);
    }

    @Test
    void createMenu_Success() {
        when(menuRepository.findByMenuName(validRequest.getMenuName())).thenReturn(Optional.empty());
        when(dishRepository.findById(1L)).thenReturn(Optional.of(activeDish));
        
        Menu savedMenu = new Menu();
        savedMenu.setMenuId(10L);
        savedMenu.setMenuName(validRequest.getMenuName());
        savedMenu.setPrice(validRequest.getPrice());
        when(menuRepository.save(any(Menu.class))).thenReturn(savedMenu);

        MenuResponse response = menuService.createMenu(validRequest);
        
        assertNotNull(response);
        assertEquals(10L, response.getMenuId());
        verify(menuRepository).save(any(Menu.class));
    }

    @Test
    void createMenu_DishNotFound_ThrowsException() {
        when(menuRepository.findByMenuName(validRequest.getMenuName())).thenReturn(Optional.empty());
        when(dishRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> menuService.createMenu(validRequest));
    }

    @Test
    void createMenu_DuplicateName_ThrowsException() {
        when(menuRepository.findByMenuName(validRequest.getMenuName())).thenReturn(Optional.of(new Menu()));

        assertThrows(ResourceConflictException.class, () -> menuService.createMenu(validRequest));
    }
}
