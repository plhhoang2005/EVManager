package com.evmanager.contracts.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ContractServiceId implements Serializable {
    @Column(name = "contract_id")
    private Long contractId;

    @Column(name = "service_id")
    private Long serviceId;
}
