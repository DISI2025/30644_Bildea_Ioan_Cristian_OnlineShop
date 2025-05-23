package org.deal.core.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OrderItemDTO(
        UUID id,
        UUID orderId,
        Integer quantity,
        ProductDTO product
) implements Serializable {
}
