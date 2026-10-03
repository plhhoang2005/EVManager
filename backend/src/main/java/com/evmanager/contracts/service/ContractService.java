package com.evmanager.contracts.service;

import com.evmanager.contracts.dto.ContractRequest;
import com.evmanager.contracts.dto.ContractResponse;
import com.evmanager.contracts.dto.ContractMenuRequest;
import com.evmanager.contracts.dto.ContractMenuResponse;
import com.evmanager.contracts.dto.ContractServiceResponse;
import com.evmanager.contracts.model.ContractMenu;
import com.evmanager.contracts.model.ContractStatus;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.events.service.ConflictCheckerService;
import com.evmanager.menus.repository.MenuRepository;
import com.evmanager.services.repository.ServiceRepository;
import com.evmanager.venues.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final CustomerRepository customerRepository;
    private final VenueRepository venueRepository;
    private final MenuRepository menuRepository;
    private final ServiceRepository serviceRepository;
    private final EventRepository eventRepository;
    private final ConflictCheckerService conflictCheckerService;

    @Transactional
    public ContractResponse createContract(ContractRequest request) {
        // 1. Validate Customer
        com.evmanager.customers.model.Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new com.evmanager.exception.ResourceNotFoundException("Customer not found with id: " + request.getCustomerId()));

        // 2. Validate Venue
        com.evmanager.venues.model.Venue venue = venueRepository.findByIdWithLock(request.getEvent().getVenueId())
                .orElseThrow(() -> new com.evmanager.exception.ResourceNotFoundException("Venue not found with id: " + request.getEvent().getVenueId()));

        // 3. Conflict Checker
        conflictCheckerService.checkVenueAvailability(venue.getVenueId(), request.getEvent().getStartAt(), request.getEvent().getEndAt());

        // 4. Create Event
        com.evmanager.events.model.Event event = new com.evmanager.events.model.Event();
        event.setVenue(venue);
        event.setEventName(request.getEvent().getEventName());
        event.setStartAt(request.getEvent().getStartAt());
        event.setEndAt(request.getEvent().getEndAt());
        event.setGuestCount(request.getEvent().getGuestCount());
        event.setStatus("SCHEDULED");
        event = eventRepository.save(event);

        // 5. Create Contract
        com.evmanager.contracts.model.Contract contract = new com.evmanager.contracts.model.Contract();
        contract.setCustomer(customer);
        contract.setEvent(event);
        contract.setContractDate(LocalDate.now());
        
        Long seq = contractRepository.getNextContractCodeSequence();
        contract.setContractCode(String.format("HD-%s-%04d", LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")), seq));

        contract.setDiscountPercent(request.getDiscountPercent() != null ? request.getDiscountPercent() : BigDecimal.ZERO);
        contract.setVatPercent(request.getVatPercent() != null ? request.getVatPercent() : BigDecimal.ZERO);

        // 6. Add ContractMenus and Calculate MenuAmount
        BigDecimal totalMenuPrice = BigDecimal.ZERO;
        int totalTableCount = 0;
        if (request.getMenus() != null) {
            long uniqueMenuCount = request.getMenus().stream()
                    .map(ContractMenuRequest::getMenuId)
                    .distinct()
                    .count();
            if (uniqueMenuCount < request.getMenus().size()) {
                throw new IllegalArgumentException("Duplicate menu in request");
            }

            for (ContractMenuRequest cmr : request.getMenus()) {
                com.evmanager.menus.model.Menu m = menuRepository.findById(cmr.getMenuId())
                        .orElseThrow(() -> new com.evmanager.exception.ResourceNotFoundException("Menu not found with id: " + cmr.getMenuId()));
                
                ContractMenu cm = new ContractMenu();
                cm.setMenu(m);
                cm.setTableCount(cmr.getTableCount());
                cm.setAgreedPrice(m.getPrice());
                
                contract.addContractMenu(cm);
                
                BigDecimal amount = m.getPrice().multiply(BigDecimal.valueOf(cmr.getTableCount()));
                totalMenuPrice = totalMenuPrice.add(amount);
                totalTableCount += cmr.getTableCount();
            }
        }
        
        contract.setBackupTableCount(Math.floorDiv(totalTableCount, 10));

        // 7. Add ContractServices
        BigDecimal totalServicePrice = BigDecimal.ZERO;
        if (request.getServices() != null) {
            long uniqueServiceCount = request.getServices().stream()
                    .map(com.evmanager.contracts.dto.ContractServiceRequest::getServiceId)
                    .distinct()
                    .count();
            if (uniqueServiceCount < request.getServices().size()) {
                throw new IllegalArgumentException("Duplicate service in request");
            }

            for (com.evmanager.contracts.dto.ContractServiceRequest csr : request.getServices()) {
                com.evmanager.services.model.Service s = serviceRepository.findById(csr.getServiceId())
                        .orElseThrow(() -> new com.evmanager.exception.ResourceNotFoundException("Service not found with id: " + csr.getServiceId()));
                
                com.evmanager.contracts.model.ContractService cs = new com.evmanager.contracts.model.ContractService();
                cs.setService(s);
                cs.setQuantity(csr.getQuantity());
                cs.setAgreedUnitPrice(s.getUnitPrice());
                cs.setNote(csr.getNote());
                
                contract.addContractService(cs);
                
                totalServicePrice = totalServicePrice.add(s.getUnitPrice().multiply(BigDecimal.valueOf(csr.getQuantity())));
            }
        }

        // 8. Pricing Calculation
        BigDecimal subTotal = venue.getRentalPrice().add(totalMenuPrice).add(totalServicePrice);
        
        BigDecimal discountAmount = subTotal.multiply(contract.getDiscountPercent()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal taxableAmount = subTotal.subtract(discountAmount);
        BigDecimal vatAmount = taxableAmount.multiply(contract.getVatPercent()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = taxableAmount.add(vatAmount);
        BigDecimal depositAmount = totalAmount.multiply(BigDecimal.valueOf(0.3)).setScale(2, RoundingMode.HALF_UP);

        contract.setSubTotal(subTotal);
        contract.setTotalAmount(totalAmount);
        contract.setDepositAmount(depositAmount);

        // 9. Status Logic
        if (contract.getDiscountPercent().compareTo(BigDecimal.valueOf(10.0)) > 0) {
            contract.setStatus(ContractStatus.PENDING_APPROVAL);
        } else {
            contract.setStatus(ContractStatus.DRAFT);
        }

        contract = contractRepository.save(contract);

        // 10. Map to Response
        return mapToResponse(contract);
    }

    private ContractResponse mapToResponse(com.evmanager.contracts.model.Contract contract) {
        List<ContractMenuResponse> menus = contract.getContractMenus().stream().map(cm -> 
            ContractMenuResponse.builder()
                .menuId(cm.getMenu().getMenuId())
                .menuName(cm.getMenu().getMenuName())
                .tableCount(cm.getTableCount())
                .agreedPrice(cm.getAgreedPrice())
                .build()
        ).toList();

        List<ContractServiceResponse> services = contract.getContractServices().stream().map(cs -> 
            ContractServiceResponse.builder()
                .serviceId(cs.getService().getServiceId())
                .serviceName(cs.getService().getServiceName())
                .quantity(cs.getQuantity())
                .agreedUnitPrice(cs.getAgreedUnitPrice())
                .note(cs.getNote())
                .build()
        ).toList();

        return ContractResponse.builder()
                .contractId(contract.getContractId())
                .customerId(contract.getCustomer().getCustomerId())
                .eventId(contract.getEvent().getEventId())
                .contractCode(contract.getContractCode())
                .contractDate(contract.getContractDate())
                .backupTableCount(contract.getBackupTableCount())
                .subTotal(contract.getSubTotal())
                .discountPercent(contract.getDiscountPercent())
                .vatPercent(contract.getVatPercent())
                .totalAmount(contract.getTotalAmount())
                .depositAmount(contract.getDepositAmount())
                .status(contract.getStatus())
                .menus(menus)
                .services(services)
                .createdAt(contract.getCreatedAt())
                .updatedAt(contract.getUpdatedAt())
                .build();
    }
}
