package org.deal.core.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PaymentIntentDTO(
        String id,
        String clientSecret,
        BigDecimal amount,
        String currency,
        String status,
        String orderId
) implements Serializable {
} 