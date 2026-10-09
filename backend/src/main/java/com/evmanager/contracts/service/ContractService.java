package com.evmanager.contracts.service;

import com.evmanager.contracts.dto.ContractRequest;
import com.evmanager.contracts.dto.ContractResponse;
import com.evmanager.contracts.dto.ContractServiceResponse;
import com.evmanager.contracts.dto.ContractMenuResponse;
import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.model.ContractServiceEntity;
import com.evmanager.contracts.model.ContractServiceId;
import com.evmanager.contracts.model.ContractMenuEntity;
import com.evmanager.contracts.model.ContractMenuId;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.model.Customer;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.menus.model.Menu;
import com.evmanager.menus.repository.MenuRepository;
import com.evmanager.services.model.Service;
import com.evmanager.services.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final CustomerRepository customerRepository;
    private final EventRepository eventRepository;
    private final MenuRepository menuRepository;
    private final ServiceRepository serviceRepository;

    @org.springframework.transaction.annotation.Transactional
    public ContractResponse createContract(ContractRequest request) {
        // Validation: Date logic
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        
        if (request.getContractDate().isAfter(event.getStartAt().toLocalDate())) {
            throw new IllegalArgumentException("Contract date cannot be after event start date");
        }

        // Validation: 1-1 Event-Contract
        if (contractRepository.existsByEvent_EventId(event.getEventId())) {
            throw new ResourceConflictException("Event already has a contract");
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Contract contract = new Contract();
        contract.setCustomer(customer);
        contract.setEvent(event);
        contract.setContractDate(request.getContractDate());
        
        if (request.getTableCount() != null) {
            contract.setTableCount(request.getTableCount());
        }
        if (request.getReserveTableCount() != null) {
            contract.setReserveTableCount(request.getReserveTableCount());
        }
        
        // Generate code
        String code = "HD-" + request.getContractDate().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        contract.setContractCode(code);

        BigDecimal totalAmount = BigDecimal.ZERO;

        List<ContractMenuEntity> menuEntities = new ArrayList<>();
        if (request.getMenus() != null && !request.getMenus().isEmpty()) {
            for (com.evmanager.contracts.dto.ContractMenuRequest menuReq : request.getMenus()) {
                Menu menu = menuRepository.findById(menuReq.getMenuId())
                        .orElseThrow(() -> new ResourceNotFoundException("Menu not found: " + menuReq.getMenuId()));
                
                ContractMenuEntity cme = new ContractMenuEntity();
                ContractMenuId id = new ContractMenuId();
                id.setMenuId(menu.getMenuId());
                cme.setId(id);
                cme.setContract(contract);
                cme.setMenu(menu);
                cme.setQuantity(menuReq.getQuantity() != null ? menuReq.getQuantity() : 1);
                
                BigDecimal agreedPrice = menuReq.getAgreedPrice() != null ? menuReq.getAgreedPrice() : menu.getPrice();
                cme.setAgreedPrice(agreedPrice);
                cme.setNote(menuReq.getNote());
                
                menuEntities.add(cme);
                
                // Add to total amount: price * quantity
                totalAmount = totalAmount.add(agreedPrice.multiply(BigDecimal.valueOf(cme.getQuantity())));
            }
        }
        contract.setContractMenus(menuEntities);

        List<ContractServiceEntity> serviceEntities = new ArrayList<>();
        if (request.getServiceIds() != null && !request.getServiceIds().isEmpty()) {
            for (Long serviceId : request.getServiceIds()) {
                Service service = serviceRepository.findById(serviceId)
                        .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + serviceId));
                
                ContractServiceEntity cse = new ContractServiceEntity();
                ContractServiceId id = new ContractServiceId();
                id.setServiceId(serviceId);
                // contractId will be set after saving or mapped by Hibernate
                cse.setId(id);
                cse.setContract(contract);
                cse.setService(service);
                cse.setQuantity(1);
                cse.setAgreedUnitPrice(service.getUnitPrice()); // Snapshot!
                serviceEntities.add(cse);
                
                totalAmount = totalAmount.add(service.getUnitPrice());
            }
        }
        
        contract.setContractServices(serviceEntities);
        contract.setTotalAmount(totalAmount);
        contract.setDepositAmount(totalAmount.multiply(new BigDecimal("0.30")));
        contract.setStatus("DRAFT");

        Contract savedContract = contractRepository.save(contract);
        
        return mapToResponse(savedContract);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public Page<ContractResponse> getAllContracts(Pageable pageable) {
        return contractRepository.findAll(pageable).map(this::mapToResponse);
    }

    private ContractResponse mapToResponse(Contract contract) {
        ContractResponse res = new ContractResponse();
        res.setContractId(contract.getContractId());
        res.setContractCode(contract.getContractCode());
        res.setCustomerId(contract.getCustomer().getCustomerId());
        res.setCustomerName(contract.getCustomer().getFullName());
        res.setEventId(contract.getEvent().getEventId());
        res.setEventName(contract.getEvent().getEventName());
        
        res.setTableCount(contract.getTableCount());
        res.setReserveTableCount(contract.getReserveTableCount());
        
        if (contract.getContractMenus() != null) {
            List<ContractMenuResponse> menus = contract.getContractMenus().stream().map(cme -> {
                ContractMenuResponse cmr = new ContractMenuResponse();
                cmr.setMenuId(cme.getMenu().getMenuId());
                cmr.setMenuName(cme.getMenu().getMenuName());
                cmr.setQuantity(cme.getQuantity());
                cmr.setAgreedPrice(cme.getAgreedPrice());
                cmr.setNote(cme.getNote());
                return cmr;
            }).toList();
            res.setMenus(menus);
        }
        
        res.setContractDate(contract.getContractDate());
        res.setTotalAmount(contract.getTotalAmount());
        res.setDepositAmount(contract.getDepositAmount());
        res.setStatus(contract.getStatus());
        res.setCreatedAt(contract.getCreatedAt());
        res.setUpdatedAt(contract.getUpdatedAt());
        
        if (contract.getContractServices() != null) {
            List<ContractServiceResponse> services = contract.getContractServices().stream().map(cse -> {
                ContractServiceResponse csr = new ContractServiceResponse();
                csr.setServiceId(cse.getService().getServiceId());
                csr.setServiceName(cse.getService().getServiceName());
                csr.setQuantity(cse.getQuantity());
                csr.setAgreedUnitPrice(cse.getAgreedUnitPrice());
                return csr;
            }).collect(Collectors.toList());
            res.setServices(services);
        }
        
        return res;
    }
}
