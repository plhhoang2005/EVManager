package com.evmanager.notifications.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ContractApprovedEvent extends ApplicationEvent {
    private final Long contractId;

    public ContractApprovedEvent(Object source, Long contractId) {
        super(source);
        this.contractId = contractId;
    }
}
