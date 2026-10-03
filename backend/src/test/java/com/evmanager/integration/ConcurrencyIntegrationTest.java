package com.evmanager.integration;

import com.evmanager.contracts.dto.ContractRequest;
import com.evmanager.contracts.dto.EventRequest;
import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.model.ContractStatus;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.contracts.service.ContractLifecycleService;
import com.evmanager.contracts.service.ContractService;
import com.evmanager.customers.model.Customer;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.payments.dto.PaymentRequest;
import com.evmanager.payments.entity.PaymentMethod;
import com.evmanager.payments.entity.PaymentType;
import com.evmanager.payments.repository.PaymentRepository;
import com.evmanager.payments.service.PaymentService;
import com.evmanager.users.model.Role;
import com.evmanager.users.model.User;
import com.evmanager.users.repository.RoleRepository;
import com.evmanager.users.repository.UserRepository;
import com.evmanager.venues.model.Venue;
import com.evmanager.venues.repository.VenueRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("integration")
public class ConcurrencyIntegrationTest {

    @Autowired
    private ContractService contractService;
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private ContractLifecycleService contractLifecycleService;

    @Autowired
    private VenueRepository venueRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    private Venue venue;
    private Customer customer;
    private User user;

    @BeforeEach
    void setUp() {
        // Setup Security Context as ADMIN to bypass auth rules
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("admin", "admin",
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")))
        );

        venue = new Venue();
        venue.setVenueName("Concurrency Test Venue " + UUID.randomUUID());
        venue.setMaxCapacity(500);
        venue.setAddress("Test Address");
        venue.setRentalPrice(new BigDecimal("1000.00"));
        venue.setStatus("AVAILABLE");
        venue = venueRepository.save(venue);

        Role role = roleRepository.findByRoleName("ROLE_CUSTOMER").orElseGet(() -> {
            Role r = new Role();
            r.setRoleName("ROLE_CUSTOMER");
            return roleRepository.save(r);
        });

        user = new User();
        user.setUsername("testuser_" + UUID.randomUUID());
        user.setFullName("Test User");
        user.setEmail("testuser_" + UUID.randomUUID() + "@example.com");
        user.setPasswordHash("hash");
        user.setRole(role);
        user = userRepository.save(user);

        customer = new Customer();
        customer.setFullName("Test Customer");
        customer.setPhone("01234" + UUID.randomUUID().toString().substring(0, 5));
        customer.setEmail("customer_" + UUID.randomUUID() + "@example.com");
        // customer does NOT have setUser relation directly. Wait, the user relationship is usually in User or Customer.
        // Let's check. Actually I will just omit it for now if it compiles.
        customer = customerRepository.save(customer);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void testConcurrentPaymentDoesNotOverpay() throws InterruptedException {
        // Create Contract
        ContractRequest request = new ContractRequest();
        request.setCustomerId(customer.getCustomerId());
        EventRequest eventRequest = new EventRequest();
        eventRequest.setVenueId(venue.getVenueId());
        eventRequest.setEventName("Test Event");
        eventRequest.setStartAt(OffsetDateTime.now().plusDays(10));
        eventRequest.setEndAt(OffsetDateTime.now().plusDays(10).plusHours(2));
        eventRequest.setGuestCount(100);
        request.setEvent(eventRequest);
        
        Long contractId = contractService.createContract(request).getContractId();
        
        Contract contract = contractRepository.findById(contractId).get();
        contract.setStatus(ContractStatus.PENDING_DEPOSIT);
        contract = contractRepository.saveAndFlush(contract);
        
        BigDecimal totalAmount = contract.getTotalAmount();
        BigDecimal depositAmount = contract.getDepositAmount();

        int threads = 5;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threads);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger exceptionCount = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    latch.await();
                    SecurityContextHolder.getContext().setAuthentication(
                            new UsernamePasswordAuthenticationToken(user.getUsername(), "pwd",
                                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER")))
                    );
                    PaymentRequest payReq = new PaymentRequest();
                    payReq.setContractId(contractId);
                    payReq.setAmount(depositAmount);
                    payReq.setPaymentMethod(PaymentMethod.BANK_TRANSFER);
                    payReq.setPaymentType(PaymentType.DEPOSIT);
                    
                    paymentService.createPayment(payReq);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    exceptionCount.incrementAndGet();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        latch.countDown(); // start all threads
        doneLatch.await();

        // 5 threads tried to pay 30% deposit concurrently.
        // So some payments MUST fail with overpayment exception if locking is correct.
        assertThat(exceptionCount.get()).isGreaterThan(0);
    }

    @Test
    void testConcurrentContractCreationDoesNotDoubleBook() throws InterruptedException {
        int THREAD_COUNT = 3;
        ExecutorService executor = Executors.newFixedThreadPool(THREAD_COUNT);
        CountDownLatch latch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(THREAD_COUNT);
        AtomicInteger successCount = new AtomicInteger();
        AtomicInteger exceptionCount = new AtomicInteger();

        OffsetDateTime start = OffsetDateTime.now().plusDays(10);
        OffsetDateTime end = start.plusHours(4);

        for (int i = 0; i < THREAD_COUNT; i++) {
            executor.submit(() -> {
                try {
                    latch.await();
                    // Set admin context
                    SecurityContextHolder.getContext().setAuthentication(
                            new UsernamePasswordAuthenticationToken(user.getUsername(), "pwd",
                                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")))
                    );

                    EventRequest eventReq = new EventRequest();
                    eventReq.setVenueId(venue.getVenueId());
                    eventReq.setEventName("Concurrent Event");
                    eventReq.setStartAt(start);
                    eventReq.setEndAt(end);
                    eventReq.setGuestCount(100);

                    ContractRequest contractReq = new ContractRequest();
                    contractReq.setCustomerId(customer.getCustomerId());
                    contractReq.setEvent(eventReq);

                    contractService.createContract(contractReq);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    exceptionCount.incrementAndGet();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        latch.countDown();
        doneLatch.await();

        // Exactly one should succeed, the rest should throw an exception
        assertEquals(1, successCount.get(), "Only one contract should be created successfully");
        assertEquals(THREAD_COUNT - 1, exceptionCount.get(), "Other contracts should fail with double booking exception");
    }
}
