package org.deal.core.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.deal.core.util.OrderStatus;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OrderDTO(
        UUID id,
        UUID buyerId,
        Timestamp date,
        OrderStatus status,
        List<OrderItemDTO> items
) implements Serializable {
}
