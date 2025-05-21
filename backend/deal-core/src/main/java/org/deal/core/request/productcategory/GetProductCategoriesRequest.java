package org.deal.core.request.productcategory;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Set;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record GetProductCategoriesRequest (Set<UUID> productCategoryIds) {
}
