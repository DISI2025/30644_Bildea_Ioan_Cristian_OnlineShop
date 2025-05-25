package org.deal.productservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.ProductCategoryDTO;
import org.deal.core.dto.ProductDTO;
import org.deal.core.util.Mapper;
import org.deal.productservice.entity.ProductNode;
import org.deal.productservice.entity.UserNode;
import org.deal.productservice.repository.ProductNodeRepository;
import org.deal.productservice.repository.UserNodeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecommendationService {

    private final ProductNodeRepository productNodeRepository;
    private final UserNodeRepository userNodeRepository;

    @Transactional
    public void trackProductView(final UUID userId, final UUID productId) {
        final UserNode user = userNodeRepository.findById(userId)
                .orElseGet(() -> UserNode.builder().withId(userId).build());
        
        final ProductNode product = productNodeRepository.findById(productId)
                .orElseGet(() -> ProductNode.builder().withId(productId).build());

        // Add to viewed products
        if (user.getViewedProducts() == null) {
            user.setViewedProducts(new HashSet<>());
        }
        user.getViewedProducts().add(product);
        
        userNodeRepository.save(user);
    }

    public Page<ProductDTO> getRecommendedProducts(final UUID userId, final Pageable pageable) {
        // Get recommendations from different sources with weights
        final List<ProductNode> recommendedProducts = new ArrayList<>();
        
        // 1. Get products based on user's categories and behavior (weight: 4)
        productNodeRepository.findRecommendedProducts(userId)
                .forEach(p -> {
                    recommendedProducts.add(p);
                    recommendedProducts.add(p);
                    recommendedProducts.add(p);
                    recommendedProducts.add(p);
                });
        
        // 2. Get products from similar users (weight: 3)
        productNodeRepository.findSimilarUserProducts(userId)
                .forEach(p -> {
                    recommendedProducts.add(p);
                    recommendedProducts.add(p);
                    recommendedProducts.add(p);
                });
        
        // 3. Get products from user's preferred categories (weight: 2)
        productNodeRepository.findProductsByUserCategories(userId)
                .forEach(p -> {
                    recommendedProducts.add(p);
                    recommendedProducts.add(p);
                });
        
        // 4. Get recently viewed but not purchased products (weight: 1)
        recommendedProducts.addAll(productNodeRepository.findRecentlyViewedNotPurchased(userId));

        // Remove duplicates and sort by relevance (using weighted frequency as score)
        final List<ProductNode> uniqueSortedProducts = recommendedProducts.stream()
                .collect(Collectors.groupingBy(
                        product -> product,
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .sorted(Map.Entry.<ProductNode, Long>comparingByValue()
                        .reversed()
                        .thenComparing(e -> e.getKey().getCreatedAt()))
                .map(Map.Entry::getKey)
                .toList();

        // Handle pagination
        final int start = (int) pageable.getOffset();
        final int end = Math.min((start + pageable.getPageSize()), uniqueSortedProducts.size());
        final List<ProductNode> pageContent = uniqueSortedProducts.subList(start, end);

        // Convert to DTOs
        final List<ProductDTO> productDTOs = pageContent.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(
                productDTOs,
                pageable,
                uniqueSortedProducts.size()
        );
    }

    private ProductDTO mapToDTO(final ProductNode product) {
        return ProductDTO.builder()
                .withId(product.getId())
                .withTitle(product.getTitle())
                .withDescription(product.getDescription())
                .withPrice(product.getPrice())
                .withStock(product.getStock())
                .withImageUrl(product.getImageUrl())
                .withCategories(product.getCategories().stream()
                        .map(category -> Mapper.mapTo(category, ProductCategoryDTO.class))
                        .collect(Collectors.toSet()))
                .withSellerId(product.getSellerId())
                .withCreatedAt(product.getCreatedAt())
                .build();
    }
} 