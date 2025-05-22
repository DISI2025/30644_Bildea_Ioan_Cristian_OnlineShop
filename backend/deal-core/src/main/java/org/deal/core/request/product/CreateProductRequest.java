package org.deal.core.request.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateProductRequest(
        @JsonProperty String title,
        @JsonProperty String description,
        @JsonProperty Double price,
        @JsonProperty Integer stock,
        @JsonProperty String imageUrl,
        @JsonProperty String sellerId,
        @JsonProperty Set<String> categories
) {
}
