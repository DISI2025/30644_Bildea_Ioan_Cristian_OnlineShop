package org.deal.productservice.controller;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.ProductDTO;
import org.deal.core.response.DealResponse;
import org.deal.core.response.PaginationDetails;
import org.deal.productservice.service.RecommendationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping("/viewed-product/{userId}/{productId}")
    public DealResponse<Void> trackProductView(
            @PathVariable final UUID userId,
            @PathVariable final UUID productId) {
        recommendationService.trackProductView(userId, productId);
        return DealResponse.successResponse(null);
    }

    @GetMapping("/recommend/{userId}")
    public DealResponse<List<ProductDTO>> getRecommendedProducts(
            @PathVariable final UUID userId,
            @RequestParam(required = false) final Integer page,
            @RequestParam(required = false) final Integer size,
            @RequestParam(required = false) final String sort,
            @RequestParam(required = false) final String direction,
            UriComponentsBuilder uriBuilder) {
        
        final int pageNumber = Optional.ofNullable(page).orElse(PaginationDetails.DEFAULT_PAGE);
        final int pageSize = Optional.ofNullable(size).orElse(PaginationDetails.DEFAULT_PAGE_SIZE);
        final String sortBy = Optional.ofNullable(sort).orElse("createdAt");
        final Sort.Direction sortDir = Optional.ofNullable(direction)
                .map(Sort.Direction::fromString)
                .orElse(Sort.Direction.DESC);
        
        final Page<ProductDTO> productPage = recommendationService.getRecommendedProducts(
                userId,
                PageRequest.of(pageNumber, pageSize, Sort.by(sortDir, sortBy))
        );

        // Build next/prev URLs
        final String baseUrl = uriBuilder.path("/recommendations/recommend/{userId}")
                .queryParam("size", pageSize)
                .buildAndExpand(userId)
                .toUriString();

        final String nextUrl = productPage.hasNext() 
                ? baseUrl + "?page=" + (pageNumber + 1) 
                        + "&sort=" + sortBy 
                        + "&direction=" + sortDir.name()
                : null;

        final String prevUrl = productPage.hasPrevious() 
                ? baseUrl + "?page=" + (pageNumber - 1)
                        + "&sort=" + sortBy 
                        + "&direction=" + sortDir.name()
                : null;

        return DealResponse.successPaginatedResponse(
                productPage.getContent(),
                PaginationDetails.builder()
                        .withPage(pageNumber)
                        .withSize(pageSize)
                        .withTotalElements(productPage.getTotalElements())
                        .withTotalPages(productPage.getTotalPages())
                        .withHasNext(productPage.hasNext())
                        .withHasPrevious(productPage.hasPrevious())
                        .withNextPageUrl(nextUrl)
                        .withPreviousPageUrl(prevUrl)
                        .build()
        );
    }

} 