package org.deal.productservice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.deal.core.dto.RecommendationDto;
import org.deal.core.exception.DealError;
import org.deal.core.response.DealResponse;
import org.deal.productservice.service.RecommendationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    public DealResponse<RecommendationDto> getRecommendationsForUser(
            @PathVariable final UUID userId,
            @RequestParam(defaultValue = "10") final int limit) {
        
        log.info("Getting recommendations for user: {} with limit: {}", userId, limit);
        
        try {
            RecommendationDto recommendations = recommendationService.getRecommendationsForUser(userId, limit);
            return DealResponse.successResponse(recommendations);
        } catch (Exception e) {
            log.error("Error getting recommendations for user {}: {}", userId, e.getMessage(), e);
            return DealResponse.failureResponse(
                    new DealError("Failed to get recommendations: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/popular")
    public DealResponse<RecommendationDto> getPopularProducts(
            @RequestParam(defaultValue = "10") final int limit) {
        
        log.info("Getting popular products with limit: {}", limit);
        
        try {
            // Use a dummy UUID for popular products (no personalization)
            RecommendationDto recommendations = recommendationService.getRecommendationsForUser(UUID.randomUUID(), limit);
            return DealResponse.successResponse(recommendations);
        } catch (Exception e) {
            log.error("Error getting popular products: {}", e.getMessage(), e);
            return DealResponse.failureResponse(
                    new DealError("Failed to get popular products: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 