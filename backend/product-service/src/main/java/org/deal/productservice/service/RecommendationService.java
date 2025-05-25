package org.deal.productservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.ProductDTO;
import org.deal.core.request.product.ProductsFilter;
import org.deal.core.util.Mapper;
import org.deal.productservice.entity.Product;
import org.deal.productservice.entity.graph.ProductNode;
import org.deal.productservice.entity.graph.UserNode;
import org.deal.productservice.repository.ProductRepository;
import org.deal.productservice.repository.graph.ProductNodeRepository;
import org.deal.productservice.repository.graph.UserNodeRepository;
import org.deal.productservice.util.PaginationUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecommendationService {

    private final ProductNodeRepository productNodeRepository;
    private final UserNodeRepository userNodeRepository;
    private final ProductRepository productRepository;

    @Transactional
    public void trackProductView(final UUID userId, final UUID productId) {
        final UserNode user = userNodeRepository.findByUserId(userId)
                .orElseGet(() -> UserNode.builder().withUserId(userId).build());

        final ProductNode product = productNodeRepository.findByProductId(productId)
                .orElseGet(() -> ProductNode.builder().withProductId(productId).build());

        // Add to viewed products
        if (user.getViewedProducts() == null) {
            user.setViewedProducts(new HashSet<>());
        }
        user.getViewedProducts().add(product);
        userNodeRepository.save(user);
    }

    public Page<ProductDTO> findAll(final ProductsFilter filter) {
        final Pageable pageable = PaginationUtils.buildPageableRequest(filter);
        final Page<ProductNode> productNodes = productNodeRepository.findAll(pageable);

        final List<UUID> productIds = productNodes.getContent().stream()
                .map(ProductNode::getProductId)
                .toList();

        return productRepository.findMultipleById(productIds, pageable).map(this::mapToDTO);
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getRecommendedProducts(final UUID userId, final ProductsFilter filter) {
        // Get pageable request from filter
        final Pageable pageable = PaginationUtils.buildPageableRequest(filter);
        
        // Get recommended product nodes from Neo4j
        Page<ProductNode> recommendedNodes = productNodeRepository.findRecommendedProducts(userId, pageable);
        
        if (recommendedNodes.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }

        // Extract product IDs from nodes
        List<UUID> productIds = recommendedNodes.getContent().stream()
                .map(ProductNode::getProductId)
                .collect(Collectors.toList());

        // Fetch actual products from PostgreSQL
        List<Product> products = productRepository.findMultipleById(productIds);

        // Map to DTOs while preserving the order from Neo4j recommendations
        List<ProductDTO> recommendedProducts = productIds.stream()
                .map(id -> products.stream()
                        .filter(p -> p.getId().equals(id))
                        .findFirst()
                        .map(p -> Mapper.mapTo(p, ProductDTO.class))
                        .orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // Use the total elements from Neo4j's page
        return new PageImpl<>(recommendedProducts, pageable, recommendedNodes.getTotalElements());
    }

    private ProductDTO mapToDTO(final Product product) {
        return Mapper.mapTo(product, ProductDTO.class);
    }
} 