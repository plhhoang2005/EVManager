package com.evmanager.menus.model;

import com.evmanager.dishes.model.Dish;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "menu_dishes")
@Getter
@Setter
public class MenuDish {

    @EmbeddedId
    private MenuDishId id = new MenuDishId();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("menuId")
    @JoinColumn(name = "menu_id")
    private Menu menu;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("dishId")
    @JoinColumn(name = "dish_id")
    private Dish dish;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @Column(name = "note", length = 255)
    private String note;
}
