package org.deal.productservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.deal.core.dto.ProductDTO;
import org.deal.core.dto.RecommendationDto;
import org.deal.productservice.entity.Product;
import org.deal.productservice.repository.RecommendationRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final ProductService productService;

    public RecommendationDto getRecommendationsForUser(final UUID userId, final int limit) {
        log.info("Getting recommendations for user: {}", userId);
        
        // Try to get personalized recommendations first
        List<Product> recommendedProducts = recommendationRepository.findRecommendedProductsForUser(userId, limit);
        
        String recommendationType;
        if (recommendedProducts.isEmpty()) {
            // Fallback to popular products for new users
            log.info("No personalized recommendations found for user {}, using popular products", userId);
            recommendedProducts = recommendationRepository.findPopularProducts(limit);
            recommendationType = "POPULAR";
        } else {
            recommendationType = "PERSONALIZED";
        }

        // Get user's preferred categories
        Map<String, Integer> preferredCategories = getUserPreferredCategories(userId);

        // Convert products to DTOs
        List<ProductDTO> productDTOs = recommendedProducts.stream()
                .map(this::convertToProductDTO)
                .collect(Collectors.toList());

        return RecommendationDto.builder()
                .recommendedProducts(productDTOs)
                .preferredCategories(preferredCategories)
                .recommendationType(recommendationType)
                .totalRecommendations(productDTOs.size())
                .build();
    }

    private Map<String, Integer> getUserPreferredCategories(final UUID userId) {
        List<Object[]> categoryData = recommendationRepository.findUserPreferredCategories(userId);
        Map<String, Integer> preferredCategories = new HashMap<>();
        
        for (Object[] row : categoryData) {
            String categoryName = (String) row[0];
            Integer purchaseCount = ((Number) row[1]).intValue();
            preferredCategories.put(categoryName, purchaseCount);
        }
        
        return preferredCategories;
    }

    private ProductDTO convertToProductDTO(final Product product) {
        Set<org.deal.core.dto.ProductCategoryDTO> categoryDTOs = null;
        if (product.getCategories() != null) {
            categoryDTOs = product.getCategories().stream()
                    .map(category -> new org.deal.core.dto.ProductCategoryDTO(
                            category.getId(),
                            category.getCategoryName()
                    ))
                    .collect(Collectors.toSet());
        }
        
        return new ProductDTO(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                categoryDTOs,
                product.getSellerId(),
                product.getCreatedAt()
        );
    }
} 