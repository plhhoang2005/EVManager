package com.evmanager.payments.service;

import com.evmanager.contracts.model.Contract;
import com.evmanager.contracts.model.ContractStatus;
import com.evmanager.contracts.repository.ContractRepository;
import com.evmanager.contracts.service.ContractLifecycleService;
import com.evmanager.customers.model.Customer;
import com.evmanager.customers.repository.CustomerRepository;
import com.evmanager.payments.dto.PaymentRequest;
import com.evmanager.payments.dto.PaymentResponse;
import com.evmanager.payments.entity.Payment;
import com.evmanager.payments.entity.PaymentMethod;
import com.evmanager.payments.entity.PaymentStatus;
import com.evmanager.payments.entity.PaymentType;
import com.evmanager.payments.repository.PaymentRepository;
import com.evmanager.users.model.User;
import com.evmanager.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private ContractRepository contractRepository;
    @Mock
    private ContractLifecycleService contractLifecycleService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private PaymentService paymentService;

    private Contract contract;
    private Customer customer;

    @BeforeEach
    void setUp() {
        customer = new Customer();
        customer.setCustomerId(1L);

        contract = new Contract();
        contract.setContractId(10L);
        contract.setCustomer(customer);
        contract.setTotalAmount(new BigDecimal("1000.00"));
        contract.setStatus(ContractStatus.PENDING_DEPOSIT);

        lenient().when(contractRepository.findByIdWithLock(10L)).thenReturn(Optional.of(contract));
        SecurityContextHolder.setContext(securityContext);
    }

    private void mockSecurityUser(String role) {
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        lenient().when(authentication.isAuthenticated()).thenReturn(true);
        lenient().when(authentication.getName()).thenReturn("testuser");
        GrantedAuthority auth = new SimpleGrantedAuthority("ROLE_" + role);
        lenient().doReturn(Collections.singletonList(auth)).when(authentication).getAuthorities();

        if (role.equals("CUSTOMER")) {
            User user = new User();
            user.setEmail("test@test.com");
            lenient().when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
            lenient().when(customerRepository.findByEmail("test@test.com")).thenReturn(Optional.of(customer));
        }
    }

    @Test
    void testCreateDeposit_Valid() {
        mockSecurityUser("SALES"); // Not customer, ownership check skips
        when(contractRepository.findByIdWithLock(10L)).thenReturn(Optional.of(contract));
        when(paymentRepository.sumAmountByContractIdAndStatus(10L, PaymentStatus.SUCCESS))
                .thenReturn(BigDecimal.ZERO);

        Payment payment = Payment.builder()
                .paymentId(1L)
                .contract(contract)
                .amount(new BigDecimal("300.00"))
                .paymentType(PaymentType.DEPOSIT)
                .paymentMethod(PaymentMethod.BANK_TRANSFER)
                .status(PaymentStatus.PENDING)
                .build();
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);

        PaymentRequest request = new PaymentRequest(10L, new BigDecimal("300.00"), PaymentType.DEPOSIT, PaymentMethod.BANK_TRANSFER);
        PaymentResponse response = paymentService.createPayment(request);

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(PaymentStatus.PENDING);
    }

    @Test
    void testCreateDeposit_InvalidContractState() {
        mockSecurityUser("SALES");
        contract.setStatus(ContractStatus.DRAFT);
        when(contractRepository.findByIdWithLock(10L)).thenReturn(Optional.of(contract));

        PaymentRequest request = new PaymentRequest(10L, new BigDecimal("300.00"), PaymentType.DEPOSIT, PaymentMethod.BANK_TRANSFER);
        
        assertThatThrownBy(() -> paymentService.createPayment(request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Deposit can only be made when contract is PENDING_DEPOSIT");
    }

    @Test
    void testCreatePayment_OverpaymentRejected() {
        mockSecurityUser("SALES");
        when(contractRepository.findByIdWithLock(10L)).thenReturn(Optional.of(contract));
        when(paymentRepository.sumAmountByContractIdAndStatus(10L, PaymentStatus.SUCCESS))
                .thenReturn(new BigDecimal("800.00")); // already paid 800 out of 1000

        PaymentRequest request = new PaymentRequest(10L, new BigDecimal("300.00"), PaymentType.DEPOSIT, PaymentMethod.BANK_TRANSFER);
        
        assertThatThrownBy(() -> paymentService.createPayment(request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Overpayment is not allowed");
    }

    @Test
    void testCustomerOwnership_Allowed() {
        mockSecurityUser("CUSTOMER"); // mocked to return customer id 1
        when(contractRepository.findByIdWithLock(10L)).thenReturn(Optional.of(contract)); // contract has customer id 1
        when(paymentRepository.sumAmountByContractIdAndStatus(10L, PaymentStatus.SUCCESS)).thenReturn(BigDecimal.ZERO);
        
        Payment payment = Payment.builder().contract(contract).status(PaymentStatus.PENDING).build();
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);

        PaymentRequest request = new PaymentRequest(10L, new BigDecimal("300.00"), PaymentType.DEPOSIT, PaymentMethod.BANK_TRANSFER);
        paymentService.createPayment(request);
        
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    void testCustomerOwnership_Denied() {
        mockSecurityUser("CUSTOMER"); // mocked to return customer id 1
        Customer otherCustomer = new Customer();
        otherCustomer.setCustomerId(99L);
        contract.setCustomer(otherCustomer);

        when(contractRepository.findByIdWithLock(10L)).thenReturn(Optional.of(contract));
        
        PaymentRequest request = new PaymentRequest(10L, new BigDecimal("300.00"), PaymentType.DEPOSIT, PaymentMethod.BANK_TRANSFER);
        
        assertThatThrownBy(() -> paymentService.createPayment(request))
                .isInstanceOf(org.springframework.security.access.AccessDeniedException.class)
                .hasMessageContaining("You do not own this contract");
    }

    @Test
    void testConfirmPayment_Success_DepositEnough() {
        Payment payment = Payment.builder()
                .paymentId(100L)
                .contract(contract) // total amount 1000
                .amount(new BigDecimal("300.00"))
                .paymentType(PaymentType.DEPOSIT)
                .status(PaymentStatus.PENDING)
                .build();
        when(paymentRepository.findById(100L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any())).thenReturn(payment);
        
        when(paymentRepository.sumAmountByContractIdAndStatus(10L, PaymentStatus.SUCCESS))
                .thenReturn(new BigDecimal("300.00")); // total successful is now 300
        
        paymentService.confirmPayment(100L);

        verify(paymentRepository, times(1)).save(payment);
        assertThat(payment.getStatus()).isEqualTo(PaymentStatus.SUCCESS);
        verify(contractLifecycleService, times(1)).transitionToConfirmed(10L);
    }

    @Test
    void testConfirmPayment_DepositNotEnough() {
        Payment payment = Payment.builder()
                .paymentId(100L)
                .contract(contract)
                .amount(new BigDecimal("100.00"))
                .paymentType(PaymentType.DEPOSIT)
                .status(PaymentStatus.PENDING)
                .build();
        when(paymentRepository.findById(100L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any())).thenReturn(payment);
        
        when(paymentRepository.sumAmountByContractIdAndStatus(10L, PaymentStatus.SUCCESS))
                .thenReturn(new BigDecimal("100.00")); // total successful is 100, less than 300
        
        paymentService.confirmPayment(100L);

        verify(contractLifecycleService, never()).transitionToConfirmed(anyLong());
    }

    @Test
    void testRejectPayment_Success() {
        Payment payment = Payment.builder()
                .paymentId(100L)
                .contract(contract)
                .amount(new BigDecimal("300.00"))
                .paymentType(PaymentType.DEPOSIT)
                .status(PaymentStatus.PENDING)
                .build();
        when(paymentRepository.findById(100L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any())).thenReturn(payment);

        PaymentResponse response = paymentService.rejectPayment(100L);

        assertThat(response.getStatus()).isEqualTo(PaymentStatus.FAILED);
        verify(contractLifecycleService, never()).transitionToConfirmed(anyLong());
    }

    @Test
    void testConfirmPayment_TerminalState() {
        Payment payment = Payment.builder().status(PaymentStatus.SUCCESS).build();
        when(paymentRepository.findById(100L)).thenReturn(Optional.of(payment));

        assertThatThrownBy(() -> paymentService.confirmPayment(100L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Only PENDING payments can be confirmed");
    }

    @Test
    void testRejectPayment_TerminalState() {
        Payment payment = Payment.builder().status(PaymentStatus.FAILED).build();
        when(paymentRepository.findById(100L)).thenReturn(Optional.of(payment));

        assertThatThrownBy(() -> paymentService.rejectPayment(100L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Only PENDING payments can be rejected");
    }

    @Test
    void testGetPaymentsSummary() {
        mockSecurityUser("SALES");
        when(contractRepository.findById(10L)).thenReturn(Optional.of(contract));
        
        Payment payment1 = Payment.builder().paymentId(1L).contract(contract).amount(new BigDecimal("100.00")).status(PaymentStatus.SUCCESS).build();
        Payment payment2 = Payment.builder().paymentId(2L).contract(contract).amount(new BigDecimal("200.00")).status(PaymentStatus.SUCCESS).build();
        Payment payment3 = Payment.builder().paymentId(3L).contract(contract).amount(new BigDecimal("500.00")).status(PaymentStatus.FAILED).build();
        
        when(paymentRepository.findByContract_ContractId(10L)).thenReturn(java.util.Arrays.asList(payment1, payment2, payment3));
        when(paymentRepository.sumAmountByContractIdAndStatus(10L, PaymentStatus.SUCCESS)).thenReturn(new BigDecimal("300.00")); // 100 + 200

        com.evmanager.payments.dto.ContractPaymentSummaryResponse summary = paymentService.getPaymentsByContract(10L);

        assertThat(summary.getContractId()).isEqualTo(10L);
        assertThat(summary.getTotalAmount()).isEqualTo(new BigDecimal("1000.00"));
        assertThat(summary.getPaidAmount()).isEqualTo(new BigDecimal("300.00"));
        assertThat(summary.getRemainingAmount()).isEqualTo(new BigDecimal("700.00"));
        assertThat(summary.getPayments()).hasSize(3);
    }
}
