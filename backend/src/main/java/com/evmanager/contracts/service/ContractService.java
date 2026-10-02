package com.evmanager.contracts.service;

import com.evmanager.contracts.dto.ContractRequest;
import com.evmanager.contracts.dto.ContractResponse;
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
        com.evmanager.venues.model.Venue venue = venueRepository.findById(request.getEvent().getVenueId())
                .orElseThrow(() -> new com.evmanager.exception.ResourceNotFoundException("Venue not found with id: " + request.getEvent().getVenueId()));

        // 3. Validate Menu (optional but if provided must exist)
        com.evmanager.menus.model.Menu menu = null;
        if (request.getMenuId() != null) {
            menu = menuRepository.findById(request.getMenuId())
                    .orElseThrow(() -> new com.evmanager.exception.ResourceNotFoundException("Menu not found with id: " + request.getMenuId()));
        }

        // 4. Validate duplicate services in request
        if (request.getServices() != null) {
            long uniqueServiceCount = request.getServices().stream()
                    .map(com.evmanager.contracts.dto.ContractServiceRequest::getServiceId)
                    .distinct()
                    .count();
            if (uniqueServiceCount < request.getServices().size()) {
                throw new IllegalArgumentException("Duplicate service in request");
            }
        }

        // 5. Conflict Checker
        conflictCheckerService.checkVenueAvailability(venue.getVenueId(), request.getEvent().getStartAt(), request.getEvent().getEndAt());

        // 6. Create Event
        com.evmanager.events.model.Event event = new com.evmanager.events.model.Event();
        event.setVenue(venue);
        event.setEventName(request.getEvent().getEventName());
        event.setStartAt(request.getEvent().getStartAt());
        event.setEndAt(request.getEvent().getEndAt());
        event.setGuestCount(request.getEvent().getGuestCount());
        event.setStatus("SCHEDULED");
        event = eventRepository.save(event);

        // 7. Create Contract
        com.evmanager.contracts.model.Contract contract = new com.evmanager.contracts.model.Contract();
        contract.setCustomer(customer);
        contract.setEvent(event);
        contract.setMenu(menu);
        contract.setContractDate(java.time.LocalDate.now());
        contract.setStatus(com.evmanager.contracts.model.ContractStatus.DRAFT);
        
        Long seq = contractRepository.getNextContractCodeSequence();
        contract.setContractCode(String.format("HD-%s-%04d", java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd")), seq));

        contract.setDiscountPercent(request.getDiscountPercent() != null ? request.getDiscountPercent() : java.math.BigDecimal.ZERO);
        contract.setVatPercent(request.getVatPercent() != null ? request.getVatPercent() : java.math.BigDecimal.ZERO);

        // 8. Add ContractServices
        java.math.BigDecimal totalServicePrice = java.math.BigDecimal.ZERO;
        if (request.getServices() != null) {
            for (com.evmanager.contracts.dto.ContractServiceRequest csr : request.getServices()) {
                com.evmanager.services.model.Service s = serviceRepository.findById(csr.getServiceId())
                        .orElseThrow(() -> new com.evmanager.exception.ResourceNotFoundException("Service not found with id: " + csr.getServiceId()));
                
                com.evmanager.contracts.model.ContractService cs = new com.evmanager.contracts.model.ContractService();
                cs.setService(s);
                cs.setQuantity(csr.getQuantity());
                cs.setAgreedUnitPrice(s.getUnitPrice());
                cs.setNote(csr.getNote());
                
                contract.addContractService(cs);
                
                totalServicePrice = totalServicePrice.add(s.getUnitPrice().multiply(java.math.BigDecimal.valueOf(csr.getQuantity())));
            }
        }

        // 9. Pricing Calculation
        java.math.BigDecimal menuAmount = calculateMenuAmount(menu, event);
        java.math.BigDecimal subTotal = venue.getRentalPrice().add(menuAmount).add(totalServicePrice);
        
        java.math.BigDecimal discountAmount = subTotal.multiply(contract.getDiscountPercent()).divide(java.math.BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        java.math.BigDecimal taxableAmount = subTotal.subtract(discountAmount);
        java.math.BigDecimal vatAmount = taxableAmount.multiply(contract.getVatPercent()).divide(java.math.BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
        java.math.BigDecimal totalAmount = taxableAmount.add(vatAmount);

        contract.setSubTotal(subTotal);
        contract.setTotalAmount(totalAmount);

        contract = contractRepository.save(contract);

        // 10. Map to Response
        return mapToResponse(contract);
    }

    /**
     * Calculates the total menu amount.
     * TEMPORARY TECHNICAL BEHAVIOR: Menu pricing semantics are unresolved by business requirements.
     * Currently returns Menu.price (as a package price) strictly to avoid silent assumptions like per-person or per-table.
     */
    private java.math.BigDecimal calculateMenuAmount(com.evmanager.menus.model.Menu menu, com.evmanager.events.model.Event event) {
        if (menu == null) {
            return java.math.BigDecimal.ZERO;
        }
        return menu.getPrice();
    }

    private ContractResponse mapToResponse(com.evmanager.contracts.model.Contract contract) {
        java.util.List<com.evmanager.contracts.dto.ContractServiceResponse> services = contract.getContractServices().stream().map(cs -> 
            com.evmanager.contracts.dto.ContractServiceResponse.builder()
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
                .menuId(contract.getMenu() != null ? contract.getMenu().getMenuId() : null)
                .contractCode(contract.getContractCode())
                .contractDate(contract.getContractDate())
                .subTotal(contract.getSubTotal())
                .discountPercent(contract.getDiscountPercent())
                .vatPercent(contract.getVatPercent())
                .totalAmount(contract.getTotalAmount())
                .status(contract.getStatus())
                .services(services)
                .createdAt(contract.getCreatedAt())
                .updatedAt(contract.getUpdatedAt())
                .build();
    }
}
