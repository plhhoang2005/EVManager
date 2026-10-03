package com.evmanager.contracts.service;

import com.evmanager.contracts.dto.ContractMenuRequest;
import com.evmanager.contracts.dto.ContractRequest;
import com.evmanager.contracts.dto.ContractResponse;
import com.evmanager.contracts.dto.ContractServiceRequest;
import com.evmanager.contracts.dto.EventRequest;
import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.customers.model.Customer;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.events.model.Event;
import com.evmanager.events.repository.EventRepository;
import com.evmanager.events.service.ConflictCheckerService;
import com.evmanager.exception.ResourceConflictException;
import com.evmanager.exception.ResourceNotFoundException;
import com.evmanager.menus.model.Menu;
import com.evmanager.menus.repository.MenuRepository;
import com.evmanager.services.model.Service;
import com.evmanager.services.repository.ServiceRepository;
import com.evmanager.venues.model.Venue;
import com.evmanager.venues.repository.VenueRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContractServiceTest {

    @Mock
    private ContractRepository contractRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private VenueRepository venueRepository;
    @Mock
    private MenuRepository menuRepository;
    @Mock
    private ServiceRepository serviceRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private ConflictCheckerService conflictCheckerService;

    @InjectMocks
    private com.evmanager.contracts.service.ContractService contractService;

    private ContractRequest validRequest;
    private Customer mockCustomer;
    private Venue mockVenue;
    private Menu mockMenu;
    private Service mockService;

    @BeforeEach
    void setUp() {
        validRequest = new ContractRequest();
        validRequest.setCustomerId(1L);
        validRequest.setDiscountPercent(new BigDecimal("10"));
        validRequest.setVatPercent(new BigDecimal("8"));

        ContractMenuRequest menuReq = new ContractMenuRequest();
        menuReq.setMenuId(2L);
        menuReq.setTableCount(15);
        validRequest.setMenus(List.of(menuReq));

        EventRequest eventRequest = new EventRequest();
        eventRequest.setVenueId(3L);
        eventRequest.setEventName("Wedding");
        eventRequest.setStartAt(OffsetDateTime.now().plusDays(10));
        eventRequest.setEndAt(OffsetDateTime.now().plusDays(10).plusHours(4));
        eventRequest.setGuestCount(200);
        validRequest.setEvent(eventRequest);

        ContractServiceRequest serviceReq = new ContractServiceRequest();
        serviceReq.setServiceId(4L);
        serviceReq.setQuantity(2);
        validRequest.setServices(List.of(serviceReq));

        mockCustomer = new Customer();
        mockCustomer.setCustomerId(1L);

        mockVenue = new Venue();
        mockVenue.setVenueId(3L);
        mockVenue.setRentalPrice(new BigDecimal("10000000"));

        mockMenu = new Menu();
        mockMenu.setMenuId(2L);
        mockMenu.setPrice(new BigDecimal("500000"));

        mockService = new Service();
        mockService.setServiceId(4L);
        mockService.setUnitPrice(new BigDecimal("1000000"));
    }

    @Test
    void createContract_Success() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(mockCustomer));
        when(venueRepository.findByIdWithLock(3L)).thenReturn(Optional.of(mockVenue));
        when(menuRepository.findById(2L)).thenReturn(Optional.of(mockMenu));
        when(serviceRepository.findById(4L)).thenReturn(Optional.of(mockService));
        when(contractRepository.getNextContractCodeSequence()).thenReturn(123L);

        // capture event save
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> {
            Event e = invocation.getArgument(0);
            e.setEventId(10L);
            return e;
        });

        // capture contract save
        when(contractRepository.save(any(Contract.class))).thenAnswer(invocation -> {
            Contract c = invocation.getArgument(0);
            c.setContractId(100L);
            return c;
        });

        ContractResponse response = contractService.createContract(validRequest);

        assertThat(response).isNotNull();
        assertThat(response.getContractCode()).contains("-0123");
        // Backup table count should be 15 / 10 = 1
        assertThat(response.getBackupTableCount()).isEqualTo(1);
        
        verify(conflictCheckerService).checkVenueAvailability(eq(3L), any(OffsetDateTime.class), any(OffsetDateTime.class));
        verify(eventRepository).save(any(Event.class));
        verify(contractRepository).save(any(Contract.class));
    }

    @Test
    void createContract_CustomerNotFound() {
        when(customerRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contractService.createContract(validRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Customer not found");

        verify(eventRepository, never()).save(any());
    }

    @Test
    void createContract_VenueConflict() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(mockCustomer));
        when(venueRepository.findByIdWithLock(3L)).thenReturn(Optional.of(mockVenue));
        
        doThrow(new ResourceConflictException("Venue conflict"))
                .when(conflictCheckerService)
                .checkVenueAvailability(anyLong(), any(OffsetDateTime.class), any(OffsetDateTime.class));

        assertThatThrownBy(() -> contractService.createContract(validRequest))
                .isInstanceOf(ResourceConflictException.class);

        verify(eventRepository, never()).save(any());
        verify(contractRepository, never()).save(any());
    }


    @Test
    void createContract_DuplicateServiceInRequest() {
        ContractServiceRequest dupService = new ContractServiceRequest();
        dupService.setServiceId(4L);
        dupService.setQuantity(1);
        
        validRequest.setServices(List.of(validRequest.getServices().get(0), dupService));

        when(customerRepository.findById(1L)).thenReturn(Optional.of(mockCustomer));
        when(venueRepository.findByIdWithLock(3L)).thenReturn(Optional.of(mockVenue));
        when(menuRepository.findById(2L)).thenReturn(Optional.of(mockMenu));
        
        assertThatThrownBy(() -> contractService.createContract(validRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Duplicate service");
    }

    @Test
    void createContract_DuplicateMenuInRequest() {
        ContractMenuRequest dupMenu = new ContractMenuRequest();
        dupMenu.setMenuId(2L);
        dupMenu.setTableCount(5);
        
        validRequest.setMenus(List.of(validRequest.getMenus().get(0), dupMenu));

        when(customerRepository.findById(1L)).thenReturn(Optional.of(mockCustomer));
        when(venueRepository.findByIdWithLock(3L)).thenReturn(Optional.of(mockVenue));
        
        assertThatThrownBy(() -> contractService.createContract(validRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Duplicate menu");
    }
}
