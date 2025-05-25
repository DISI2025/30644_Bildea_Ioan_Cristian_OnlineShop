package org.deal.productservice.util;

import jakarta.persistence.criteria.Path;
import jakarta.servlet.http.HttpServletRequest;
import org.deal.core.request.product.ProductsFilter;
import org.deal.core.response.PaginationDetails;
import org.deal.core.util.SortDir;
import org.deal.productservice.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class PaginationUtils {

    public static String buildPageUrl(final HttpServletRequest request, final int page, final int size) {
        String baseUrl = request.getRequestURL().toString();
        Map<String, String[]> parameterMap = new HashMap<>(request.getParameterMap());
        parameterMap.remove("page");
        parameterMap.remove("size");

        String remainingQuery = parameterMap.entrySet().stream()
                .flatMap(entry -> Arrays.stream(entry.getValue())
                        .map(value -> entry.getKey() + "=" + URLEncoder.encode(value, StandardCharsets.UTF_8)))
                .collect(Collectors.joining("&"));

        StringBuilder urlBuilder = new StringBuilder(baseUrl)
                .append("?page=").append(page)
                .append("&size=").append(size);

        if (!remainingQuery.isEmpty()) {
            urlBuilder.append("&").append(remainingQuery);
        }

        return urlBuilder.toString();
    }

    public static PaginationDetails buildPaginationDetails(final Page<?> page, final HttpServletRequest request, final int size) {
        int currentPage = page.getNumber();
        int totalPages = page.getTotalPages();

        return PaginationDetails.builder()
                .withPage(currentPage)
                .withSize(size)
                .withTotalElements(page.getTotalElements())
                .withTotalPages(totalPages)
                .withHasNext(page.hasNext())
                .withHasPrevious(page.hasPrevious())
                .withNextPageUrl(currentPage + 1 < totalPages ?
                                 PaginationUtils.buildPageUrl(request, currentPage + 1, size) : null)
                .withPreviousPageUrl(currentPage > 0 ?
                                     PaginationUtils.buildPageUrl(request, currentPage - 1, size) : null)
                .build();
    }

    public static Pageable buildPageableRequest(final ProductsFilter filter) {
        final String sortProperty = Optional.ofNullable(filter.property()).orElse(Product.DEFAULT_SORTING_PROPERTY);
        final SortDir sortDir = Optional.ofNullable(filter.sort()).orElse(SortDir.ASC);
        final int page = Optional.ofNullable(filter.page()).orElse(PaginationDetails.DEFAULT_PAGE);
        final int size = Optional.ofNullable(filter.size()).orElse(PaginationDetails.DEFAULT_PAGE_SIZE);

        final Sort sort = Sort.by(Sort.Direction.fromString(sortDir.name()), sortProperty);
        return PageRequest.of(page, size, sort);
    }

    public static <T> Specification<T> buildSpecification(final ProductsFilter filter) {
        final String sortProperty = Optional.ofNullable(filter.property()).orElse(Product.DEFAULT_SORTING_PROPERTY);
        final String searchValue = Optional.ofNullable(filter.search()).orElse("");

        return (root, query, cb) -> {
            if (!searchValue.isBlank()) {
                Path<String> path = root.get(sortProperty);
                return cb.like(cb.lower(path), "%" + searchValue.toLowerCase() + "%");
            }
            return cb.conjunction();
        };
    }
}
