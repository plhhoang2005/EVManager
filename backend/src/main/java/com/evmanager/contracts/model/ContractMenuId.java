package com.evmanager.contracts.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@EqualsAndHashCode
public class ContractMenuId implements Serializable {

    @Column(name = "contract_id")
    private Long contractId;

    @Column(name = "menu_id")
    private Long menuId;

    public ContractMenuId() {}

    public ContractMenuId(Long contractId, Long menuId) {
        this.contractId = contractId;
        this.menuId = menuId;
    }
}
