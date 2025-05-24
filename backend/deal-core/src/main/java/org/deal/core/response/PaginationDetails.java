package org.deal.core.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;

@Builder(setterPrefix = "with")
@JsonIgnoreProperties(ignoreUnknown = true)
public record PaginationDetails(
        Integer page,
        Integer size,
        Long totalElements,
        Integer totalPages,
        boolean hasNext,
        boolean hasPrevious,
        String nextPageUrl,
        String previousPageUrl
) {
    public static final Integer DEFAULT_PAGE_SIZE = 10;
    public static final Integer DEFAULT_PAGE = 0;
}
