package org.deal.productservice.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.deal.core.dto.PaymentIntentDTO;
import org.deal.core.exception.DealException;
import org.deal.core.request.order.CreatePaymentIntentRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class StripeService {
    @Value("${stripe-key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public PaymentIntentDTO createPaymentIntent(final CreatePaymentIntentRequest request) {
        try {
            long amountInCents = request.amount().multiply(BigDecimal.valueOf(100)).longValue();

            Map<String, String> metadata = new HashMap<>();
            metadata.put("order_id", request.orderId());
            metadata.put("customer_email", request.customerEmail());

            if (request.customerDetails() != null) {
                metadata.put("customer_name", request.customerDetails().fullName());
                metadata.put("customer_phone", request.customerDetails().phoneNumber());
            }

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency(request.currency().toLowerCase())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .putAllMetadata(metadata)
                    .setDescription("Payment for Order: " + request.orderId())
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            return new PaymentIntentDTO(
                    paymentIntent.getId(),
                    paymentIntent.getClientSecret(),
                    request.amount(),
                    request.currency(),
                    paymentIntent.getStatus(),
                    request.orderId()
            );

        } catch (StripeException e) {
            throw new DealException("Failed to create payment intent: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}