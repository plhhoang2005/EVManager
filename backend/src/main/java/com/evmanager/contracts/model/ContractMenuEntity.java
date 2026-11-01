package com.evmanager.contracts.model;

import com.evmanager.menus.model.Menu;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "contract_menus")
@Getter
@Setter
public class ContractMenuEntity {

    @EmbeddedId
    private ContractMenuId id = new ContractMenuId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("contractId")
    @JoinColumn(name = "contract_id")
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("menuId")
    @JoinColumn(name = "menu_id")
    private Menu menu;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @Column(name = "agreed_price", nullable = false)
    private BigDecimal agreedPrice;

    @Column(name = "note")
    private String note;
}
