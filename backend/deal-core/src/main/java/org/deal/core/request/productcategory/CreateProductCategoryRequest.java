package org.deal.core.request.productcategory;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateProductCategoryRequest(String categoryName) {
}
