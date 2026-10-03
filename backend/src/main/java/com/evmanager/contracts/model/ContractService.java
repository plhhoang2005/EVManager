package com.evmanager.contracts.model;

import com.evmanager.services.model.Service;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "contract_services")
@Getter
@Setter
public class ContractService {

    @EmbeddedId
    private ContractServiceId id = new ContractServiceId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("contractId")
    @JoinColumn(name = "contract_id")
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("serviceId")
    @JoinColumn(name = "service_id")
    private Service service;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @Column(name = "agreed_unit_price", nullable = false, precision = 18, scale = 2)
    private BigDecimal agreedUnitPrice;

    @Column(name = "note", length = 255)
    private String note;
}
