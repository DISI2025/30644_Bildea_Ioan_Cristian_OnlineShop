package org.deal.productservice.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.deal.core.dto.ProductDTO;
import org.deal.core.request.product.ProductsFilter;
import org.deal.core.response.DealResponse;
import org.deal.core.response.PaginationDetails;
import org.deal.productservice.service.RecommendationService;
import org.deal.productservice.service.TrackingFacade;
import org.deal.productservice.util.PaginationUtils;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class RecommendationController {
    private final RecommendationService recommendationService;
    private final TrackingFacade trackingFacade;

    @PostMapping("/viewed-product/{userId}/{productId}")
    public DealResponse<Void> trackProductView(
            @PathVariable final UUID userId,
            @PathVariable final UUID productId) {
        trackingFacade.trackProductView(userId, productId);
        return DealResponse.successResponse(null);
    }

    @GetMapping("/{userId}")
    public DealResponse<List<ProductDTO>> getRecommendedProducts(
            @PathVariable final UUID userId,
            final ProductsFilter filter,
            final HttpServletRequest request) {
        Page<ProductDTO> page = recommendationService.getRecommendedProducts(userId, filter);
        List<ProductDTO> products = page.getContent();
        var size = Optional.ofNullable(filter.size()).orElse(PaginationDetails.DEFAULT_PAGE_SIZE);

        return DealResponse.successPaginatedResponse(products, PaginationUtils.buildPaginationDetails(page, request, size));
    }
} 