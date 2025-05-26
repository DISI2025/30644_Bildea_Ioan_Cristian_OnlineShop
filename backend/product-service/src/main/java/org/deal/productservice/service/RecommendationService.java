package org.deal.productservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.ProductDTO;
import org.deal.core.request.product.ProductsFilter;
import org.deal.core.util.Mapper;
import org.deal.productservice.entity.Product;
import org.deal.productservice.entity.graph.ProductNode;
import org.deal.productservice.repository.ProductRepository;
import org.deal.productservice.repository.graph.ProductNodeRepository;
import org.deal.productservice.util.PaginationUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecommendationService {

    private static final int MINIMUM_RECOMMENDATIONS = 4;

    private final ProductNodeRepository productNodeRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<ProductDTO> getRecommendedProducts(final UUID userId, final ProductsFilter filter) {
        final Pageable pageable = PaginationUtils.buildPageableRequest(filter);
        Page<ProductNode> recommendedNodes = productNodeRepository.findRecommendedProducts(userId, pageable);

        if (recommendedNodes.isEmpty() || recommendedNodes.getTotalElements() < MINIMUM_RECOMMENDATIONS) {
            var popularProducts = productRepository.findPopularProducts(MINIMUM_RECOMMENDATIONS).stream()
                    .map(this::mapToDTO).toList();
            return new PageImpl<>(popularProducts, pageable, MINIMUM_RECOMMENDATIONS);
        }

        List<UUID> productIds = recommendedNodes.getContent().stream()
                .map(ProductNode::getProductId)
                .collect(Collectors.toList());

        List<ProductDTO> recommendedProducts = productRepository.findMultipleById(productIds).stream().map(this::mapToDTO).toList();
        return new PageImpl<>(recommendedProducts, pageable, recommendedNodes.getTotalElements());
    }

    private ProductDTO mapToDTO(final Product product) {
        return Mapper.mapTo(product, ProductDTO.class);
    }
} 