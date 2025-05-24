package org.deal.core.request.order;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.math.BigDecimal;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreatePaymentIntentRequest(
        @JsonProperty BigDecimal amount,
        @JsonProperty String currency,
        @JsonProperty String customerEmail,
        @JsonProperty String customerPhone,
        @JsonProperty String orderId,
        @JsonProperty CustomerDetails customerDetails
) implements Serializable {

    public record CustomerDetails(
            @JsonProperty String fullName,
            @JsonProperty String address,
            @JsonProperty String city,
            @JsonProperty String postalCode,
            @JsonProperty String country,
            @JsonProperty String phoneNumber,
            @JsonProperty String email
    ) implements Serializable {
    }
} 