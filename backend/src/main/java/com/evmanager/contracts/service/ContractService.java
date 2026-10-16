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
import java.math.RoundingMode;
import java.time.LocalDate;
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
        Event event = eventRepository.findByIdWithPessimisticWriteLock(request.getEventId())
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
        
        // Generate contract code strictly conforming to UC-09: HD-YYYYMMDD-XXX
        long seq = contractRepository.countByContractDate(request.getContractDate()) + 1;
        String dateStr = request.getContractDate().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String code = String.format("HD-%s-%03d", dateStr, seq);
        if (contractRepository.existsByContractCode(code)) {
            code = "HD-" + dateStr + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        }
        contract.setContractCode(code);

        BigDecimal menuTotal = BigDecimal.ZERO;

        List<ContractMenuEntity> menuEntities = new ArrayList<>();
        List<com.evmanager.contracts.dto.ContractMenuRequest> menuRequests = request.getMenus();
        if ((menuRequests == null || menuRequests.isEmpty()) && request.getMenuId() != null) {
            com.evmanager.contracts.dto.ContractMenuRequest singleMenu = new com.evmanager.contracts.dto.ContractMenuRequest();
            singleMenu.setMenuId(request.getMenuId());
            singleMenu.setQuantity(request.getTableCount() != null && request.getTableCount() > 0 ? request.getTableCount() : 1);
            menuRequests = List.of(singleMenu);
        }

        if (menuRequests != null && !menuRequests.isEmpty()) {
            for (com.evmanager.contracts.dto.ContractMenuRequest menuReq : menuRequests) {
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
                
                // Add to menu total: price * quantity
                menuTotal = menuTotal.add(agreedPrice.multiply(BigDecimal.valueOf(cme.getQuantity())));
            }
        }
        contract.setContractMenus(menuEntities);

        BigDecimal serviceTotal = BigDecimal.ZERO;
        List<ContractServiceEntity> serviceEntities = new ArrayList<>();
        if (request.getServiceIds() != null && !request.getServiceIds().isEmpty()) {
            for (Long serviceId : request.getServiceIds()) {
                Service service = serviceRepository.findById(serviceId)
                        .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + serviceId));
                
                ContractServiceEntity cse = new ContractServiceEntity();
                ContractServiceId id = new ContractServiceId();
                id.setServiceId(serviceId);
                cse.setId(id);
                cse.setContract(contract);
                cse.setService(service);
                cse.setQuantity(1);
                cse.setAgreedUnitPrice(service.getUnitPrice()); // Snapshot!
                serviceEntities.add(cse);
                
                serviceTotal = serviceTotal.add(service.getUnitPrice());
            }
        }
        contract.setContractServices(serviceEntities);

        // SubTotal before discounts
        BigDecimal subTotal = menuTotal.add(serviceTotal);

        // 1. Áp dụng Chiết khấu % TRƯỚC (trên tiền thực đơn bàn nếu có, hoặc subTotal)
        BigDecimal discountPercent = request.getDiscountPercent() != null ? request.getDiscountPercent() : BigDecimal.ZERO;
        if (discountPercent.compareTo(BigDecimal.ZERO) < 0 || discountPercent.compareTo(new BigDecimal("100")) > 0) {
            throw new IllegalArgumentException("Discount percentage must be between 0 and 100");
        }
        BigDecimal discountTarget = menuTotal.compareTo(BigDecimal.ZERO) > 0 ? menuTotal : subTotal;
        BigDecimal discountAmount = discountTarget.multiply(discountPercent)
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
        BigDecimal afterDiscount = subTotal.subtract(discountAmount);
        if (afterDiscount.compareTo(BigDecimal.ZERO) < 0) {
            afterDiscount = BigDecimal.ZERO;
        }

        // 2. Tiếp tục trừ Voucher khuyến mãi tiền mặt TRỰC TIẾP SAU chiết khấu theo BUG-03
        BigDecimal voucherAmount = request.getVoucherAmount() != null ? request.getVoucherAmount() : BigDecimal.ZERO;
        if (voucherAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Voucher amount cannot be negative");
        }
        BigDecimal netSubTotal = afterDiscount.subtract(voucherAmount);
        if (netSubTotal.compareTo(BigDecimal.ZERO) < 0) {
            netSubTotal = BigDecimal.ZERO;
        }

        // 3. Thuế GTGT VAT (mặc định 0% nếu không chỉ định; nếu chỉ định e.g. 8% thì tính trên netSubTotal)
        BigDecimal vatPercent = request.getVatPercent() != null ? request.getVatPercent() : BigDecimal.ZERO;
        if (vatPercent.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("VAT percentage cannot be negative");
        }
        BigDecimal vatAmount = netSubTotal.multiply(vatPercent)
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);

        // 4. Tổng giá trị hợp đồng
        BigDecimal totalAmount = netSubTotal.add(vatAmount);

        // 5. Tiền đặt cọc tối thiểu đợt 1 (30% tổng giá trị hợp đồng)
        BigDecimal minDeposit = totalAmount.multiply(new BigDecimal("0.30")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal depositAmount = minDeposit;
        if (request.getDepositAmount() != null) {
            if (request.getDepositAmount().compareTo(minDeposit.setScale(0, RoundingMode.DOWN)) < 0) {
                throw new IllegalArgumentException("Deposit amount must be at least 30% of total contract amount (" + minDeposit.setScale(0, RoundingMode.HALF_UP) + ")");
            }
            depositAmount = request.getDepositAmount();
        }

        contract.setSubTotal(subTotal);
        contract.setDiscountPercent(discountPercent);
        contract.setVoucherAmount(voucherAmount);
        contract.setVatPercent(vatPercent);
        contract.setTotalAmount(totalAmount);
        contract.setDepositAmount(depositAmount);
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
        
        if (contract.getContractMenus() != null && !contract.getContractMenus().isEmpty()) {
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

            // Backward compatibility for single menu consumers
            ContractMenuEntity firstMenu = contract.getContractMenus().get(0);
            res.setMenuId(firstMenu.getMenu().getMenuId());
            res.setMenuName(firstMenu.getMenu().getMenuName());
        }
        
        res.setContractDate(contract.getContractDate());
        res.setSubTotal(contract.getSubTotal());
        res.setDiscountPercent(contract.getDiscountPercent());
        res.setVoucherAmount(contract.getVoucherAmount());
        res.setVatPercent(contract.getVatPercent());
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
