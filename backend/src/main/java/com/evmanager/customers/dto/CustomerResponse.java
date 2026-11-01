package com.evmanager.customers.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class CustomerResponse {
    private Long customerId;
    private String fullName;
    private String phone;
    private String email;
    private String address;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
