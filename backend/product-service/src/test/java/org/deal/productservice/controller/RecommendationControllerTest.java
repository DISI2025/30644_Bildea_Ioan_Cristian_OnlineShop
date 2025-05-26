package org.deal.productservice.controller;

import org.deal.core.dto.RecommendationDto;
import org.deal.core.response.DealResponse;
import org.deal.productservice.service.RecommendationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecommendationControllerTest {

    @Mock
    private RecommendationService recommendationService;

    @InjectMocks
    private RecommendationController recommendationController;

    private UUID userId;
    private RecommendationDto testRecommendationDto;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        
        Map<String, Integer> preferredCategories = new HashMap<>();
        preferredCategories.put("Electronics", 5);
        preferredCategories.put("Books", 3);

        testRecommendationDto = RecommendationDto.builder()
                .recommendedProducts(Collections.emptyList())
                .preferredCategories(preferredCategories)
                .recommendationType("PERSONALIZED")
                .totalRecommendations(0)
                .build();
    }

    @Test
    void getRecommendationsForUser_WithValidUserId_ReturnsOk() {
        // Given
        when(recommendationService.getRecommendationsForUser(userId, 10))
                .thenReturn(testRecommendationDto);

        // When
        DealResponse<RecommendationDto> response = recommendationController
                .getRecommendationsForUser(userId, 10);

        // Then
        assertEquals(HttpStatus.OK, response.getStatus());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("payload"));
        
        @SuppressWarnings("unchecked")
        RecommendationDto payload = (RecommendationDto) response.getBody().get("payload");
        assertNotNull(payload);
        assertEquals("PERSONALIZED", payload.getRecommendationType());
        assertEquals(0, payload.getTotalRecommendations());
        assertEquals(2, payload.getPreferredCategories().size());

        verify(recommendationService).getRecommendationsForUser(userId, 10);
    }

    @Test
    void getRecommendationsForUser_WithCustomLimit_UsesCustomLimit() {
        // Given
        int customLimit = 20;
        when(recommendationService.getRecommendationsForUser(userId, customLimit))
                .thenReturn(testRecommendationDto);

        // When
        DealResponse<RecommendationDto> response = recommendationController
                .getRecommendationsForUser(userId, customLimit);

        // Then
        assertEquals(HttpStatus.OK, response.getStatus());
        verify(recommendationService).getRecommendationsForUser(userId, customLimit);
    }

    @Test
    void getRecommendationsForUser_WhenServiceThrowsException_ReturnsInternalServerError() {
        // Given
        when(recommendationService.getRecommendationsForUser(any(UUID.class), any(Integer.class)))
                .thenThrow(new RuntimeException("Database error"));

        // When
        DealResponse<RecommendationDto> response = recommendationController
                .getRecommendationsForUser(userId, 10);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatus());
        assertTrue(response.getBody().containsKey("errors"));

        verify(recommendationService).getRecommendationsForUser(userId, 10);
    }

    @Test
    void getPopularProducts_WithDefaultLimit_ReturnsOk() {
        // Given
        RecommendationDto popularRecommendations = RecommendationDto.builder()
                .recommendedProducts(Collections.emptyList())
                .preferredCategories(Collections.emptyMap())
                .recommendationType("POPULAR")
                .totalRecommendations(0)
                .build();

        when(recommendationService.getRecommendationsForUser(any(UUID.class), eq(10)))
                .thenReturn(popularRecommendations);

        // When
        DealResponse<RecommendationDto> response = recommendationController
                .getPopularProducts(10);

        // Then
        assertEquals(HttpStatus.OK, response.getStatus());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().containsKey("payload"));
        
        @SuppressWarnings("unchecked")
        RecommendationDto payload = (RecommendationDto) response.getBody().get("payload");
        assertEquals("POPULAR", payload.getRecommendationType());

        verify(recommendationService).getRecommendationsForUser(any(UUID.class), eq(10));
    }

    @Test
    void getPopularProducts_WithCustomLimit_UsesCustomLimit() {
        // Given
        int customLimit = 15;
        RecommendationDto popularRecommendations = RecommendationDto.builder()
                .recommendedProducts(Collections.emptyList())
                .preferredCategories(Collections.emptyMap())
                .recommendationType("POPULAR")
                .totalRecommendations(0)
                .build();

        when(recommendationService.getRecommendationsForUser(any(UUID.class), eq(customLimit)))
                .thenReturn(popularRecommendations);

        // When
        DealResponse<RecommendationDto> response = recommendationController
                .getPopularProducts(customLimit);

        // Then
        assertEquals(HttpStatus.OK, response.getStatus());
        verify(recommendationService).getRecommendationsForUser(any(UUID.class), eq(customLimit));
    }

    @Test
    void getPopularProducts_WhenServiceThrowsException_ReturnsInternalServerError() {
        // Given
        when(recommendationService.getRecommendationsForUser(any(UUID.class), any(Integer.class)))
                .thenThrow(new RuntimeException("Service unavailable"));

        // When
        DealResponse<RecommendationDto> response = recommendationController
                .getPopularProducts(10);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatus());
        assertTrue(response.getBody().containsKey("errors"));

        verify(recommendationService).getRecommendationsForUser(any(UUID.class), eq(10));
    }
} 