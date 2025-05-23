package org.deal.core.request.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AssignProductCategoryRequest (
        @JsonProperty UUID userId,
        @JsonProperty Set<UUID> productCategoryIds
        ) {
}
