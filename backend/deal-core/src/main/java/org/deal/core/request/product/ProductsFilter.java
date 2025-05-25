package org.deal.core.request.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.deal.core.util.SortDir;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ProductsFilter(
        @JsonProperty String property,
        @JsonProperty String search,
        @JsonProperty SortDir sort,
        @JsonProperty Integer page,
        @JsonProperty Integer size
) {
}
