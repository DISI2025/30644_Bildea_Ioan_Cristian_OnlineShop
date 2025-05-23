package org.deal.core.request.order;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateOrderRequest(
        @JsonProperty UUID buyerId,
        @JsonProperty List<CreateOrderItemRequest> items) {

    public record CreateOrderItemRequest(
            @JsonProperty Integer quantity,
            @JsonProperty UUID productId
    ) implements Serializable {
    }
}
