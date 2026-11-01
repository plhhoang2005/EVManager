package com.evmanager.menus.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuDishId implements Serializable {
    @Column(name = "menu_id")
    private Long menuId;

    @Column(name = "dish_id")
    private Long dishId;
}
