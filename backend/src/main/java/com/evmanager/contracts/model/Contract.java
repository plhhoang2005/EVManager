package com.evmanager.contracts.model;

import com.evmanager.customers.model.Customer;
import com.evmanager.events.model.Event;
import com.evmanager.menus.model.Menu;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contracts")
@Getter
@Setter
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contract_id")
    private Long contractId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false, unique = true)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id")
    private Menu menu;

    @Column(name = "contract_code", nullable = false, unique = true, length = 50)
    private String contractCode;

    @Column(name = "contract_date", nullable = false)
    private LocalDate contractDate;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "deposit_amount", nullable = false)
    private BigDecimal depositAmount = BigDecimal.ZERO;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "DRAFT";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContractServiceEntity> contractServices = new ArrayList<>();
}
