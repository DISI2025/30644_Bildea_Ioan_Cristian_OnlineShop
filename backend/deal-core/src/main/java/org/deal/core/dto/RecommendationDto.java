package org.deal.core.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationDto {
    private List<ProductDTO> recommendedProducts;
    private Map<String, Integer> preferredCategories;
    private String recommendationType; // "PERSONALIZED" or "POPULAR"
    private int totalRecommendations;
} 