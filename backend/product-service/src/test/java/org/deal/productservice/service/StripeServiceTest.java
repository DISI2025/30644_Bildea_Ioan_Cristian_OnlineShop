package org.deal.productservice.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.deal.core.dto.PaymentIntentDTO;
import org.deal.core.exception.DealException;
import org.deal.core.request.order.CreatePaymentIntentRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mockStatic;

@ExtendWith(MockitoExtension.class)
class StripeServiceTest {

    @InjectMocks
    private StripeService stripeService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(stripeService, "stripeSecretKey", "sk_test_fake_key");
        stripeService.init();
    }

    @Test
    void createPaymentIntent_Success() throws StripeException {
        // Given
        CreatePaymentIntentRequest.CustomerDetails customerDetails = 
            new CreatePaymentIntentRequest.CustomerDetails(
                "John Doe",
                "123 Main St",
                "New York",
                "10001",
                "US",
                "+1234567890",
                "john.doe@example.com"
            );

        CreatePaymentIntentRequest request = new CreatePaymentIntentRequest(
            new BigDecimal("99.99"),
            "USD",
            "customer@example.com",
            "+1234567890",
            "order-123",
            customerDetails
        );

        // Mock PaymentIntent
        PaymentIntent mockPaymentIntent = createMockPaymentIntent();

        // When
        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic.when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                       .thenReturn(mockPaymentIntent);

            PaymentIntentDTO result = stripeService.createPaymentIntent(request);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.id()).isEqualTo("pi_test_123");
            assertThat(result.clientSecret()).isEqualTo("pi_test_123_secret_test");
            assertThat(result.amount()).isEqualTo(new BigDecimal("99.99"));
            assertThat(result.currency()).isEqualTo("USD");
            assertThat(result.status()).isEqualTo("requires_payment_method");
            assertThat(result.orderId()).isEqualTo("order-123");
        }
    }

    @Test
    void createPaymentIntent_Success_WithoutCustomerDetails() throws StripeException {
        // Given
        CreatePaymentIntentRequest request = new CreatePaymentIntentRequest(
            new BigDecimal("50.00"),
            "EUR",
            "test@example.com",
            "+9876543210",
            "order-456",
            null
        );

        // Mock PaymentIntent
        PaymentIntent mockPaymentIntent = createMockPaymentIntent();

        // When
        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic.when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                       .thenReturn(mockPaymentIntent);

            PaymentIntentDTO result = stripeService.createPaymentIntent(request);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.id()).isEqualTo("pi_test_123");
            assertThat(result.clientSecret()).isEqualTo("pi_test_123_secret_test");
            assertThat(result.amount()).isEqualTo(new BigDecimal("50.00"));
            assertThat(result.currency()).isEqualTo("EUR");
            assertThat(result.status()).isEqualTo("requires_payment_method");
            assertThat(result.orderId()).isEqualTo("order-456");
        }
    }

    @Test
    void createPaymentIntent_Success_AmountConversion() throws StripeException {
        // Given - Test that decimal amounts are properly converted to cents
        CreatePaymentIntentRequest request = new CreatePaymentIntentRequest(
            new BigDecimal("123.45"),
            "USD",
            "test@example.com",
            "+1234567890",
            "order-789",
            null
        );

        // Mock PaymentIntent
        PaymentIntent mockPaymentIntent = createMockPaymentIntent();

        // When
        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic.when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                       .thenReturn(mockPaymentIntent);

            PaymentIntentDTO result = stripeService.createPaymentIntent(request);

            // Then
            assertThat(result).isNotNull();
            assertThat(result.amount()).isEqualTo(new BigDecimal("123.45"));
        }
    }

    @Test
    void createPaymentIntent_Failure_StripeException() throws StripeException {
        // Given
        CreatePaymentIntentRequest request = new CreatePaymentIntentRequest(
            new BigDecimal("99.99"),
            "USD",
            "customer@example.com",
            "+1234567890",
            "order-123",
            null
        );

        // When
        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic.when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                       .thenThrow(new StripeException("Invalid API key", "invalid_request_error", "api_key", 401) {});

            // Then
            assertThatThrownBy(() -> stripeService.createPaymentIntent(request))
                .isInstanceOf(DealException.class)
                .hasMessageContaining("Failed to create payment intent: Invalid API key")
                .extracting("status")
                .isEqualTo(HttpStatus.BAD_REQUEST);
        }
    }

    @Test
    void createPaymentIntent_Failure_CardDeclined() throws StripeException {
        // Given
        CreatePaymentIntentRequest request = new CreatePaymentIntentRequest(
            new BigDecimal("99.99"),
            "USD",
            "customer@example.com",
            "+1234567890",
            "order-123",
            null
        );

        // When
        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic.when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                       .thenThrow(new StripeException("Your card was declined.", "card_error", "card_declined", 402) {});

            // Then
            assertThatThrownBy(() -> stripeService.createPaymentIntent(request))
                .isInstanceOf(DealException.class)
                .hasMessageContaining("Failed to create payment intent: Your card was declined.")
                .extracting("status")
                .isEqualTo(HttpStatus.BAD_REQUEST);
        }
    }

    @Test
    void createPaymentIntent_Failure_InsufficientFunds() throws StripeException {
        // Given
        CreatePaymentIntentRequest request = new CreatePaymentIntentRequest(
            new BigDecimal("999999.99"),
            "USD",
            "customer@example.com",
            "+1234567890",
            "order-123",
            null
        );

        // When
        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic.when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                       .thenThrow(new StripeException("Insufficient funds in account.", "card_error", "insufficient_funds", 402) {});

            // Then
            assertThatThrownBy(() -> stripeService.createPaymentIntent(request))
                .isInstanceOf(DealException.class)
                .hasMessageContaining("Failed to create payment intent: Insufficient funds in account.")
                .extracting("status")
                .isEqualTo(HttpStatus.BAD_REQUEST);
        }
    }

    @Test
    void createPaymentIntent_Failure_NetworkError() throws StripeException {
        // Given
        CreatePaymentIntentRequest request = new CreatePaymentIntentRequest(
            new BigDecimal("99.99"),
            "USD",
            "customer@example.com",
            "+1234567890",
            "order-123",
            null
        );

        // When
        try (MockedStatic<PaymentIntent> mockedStatic = mockStatic(PaymentIntent.class)) {
            mockedStatic.when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                       .thenThrow(new StripeException("Network error occurred", "api_connection_error", null, 500) {});

            // Then
            assertThatThrownBy(() -> stripeService.createPaymentIntent(request))
                .isInstanceOf(DealException.class)
                .hasMessageContaining("Failed to create payment intent: Network error occurred")
                .extracting("status")
                .isEqualTo(HttpStatus.BAD_REQUEST);
        }
    }

    private PaymentIntent createMockPaymentIntent() throws StripeException {
        PaymentIntent paymentIntent = new PaymentIntent();
        
        ReflectionTestUtils.setField(paymentIntent, "id", "pi_test_123");
        ReflectionTestUtils.setField(paymentIntent, "clientSecret", "pi_test_123_secret_test");
        ReflectionTestUtils.setField(paymentIntent, "status", "requires_payment_method");
        
        return paymentIntent;
    }
}