package org.deal.productservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.productservice.entity.Product;
import org.deal.productservice.entity.graph.ProductCategoryNode;
import org.deal.productservice.entity.graph.ProductNode;
import org.deal.productservice.entity.graph.UserNode;
import org.deal.productservice.repository.graph.ProductCategoryNodeRepository;
import org.deal.productservice.repository.graph.ProductNodeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductSyncService {

    private final ProductNodeRepository productNodeRepository;
    private final ProductCategoryNodeRepository productCategoryNodeRepository;

    @Transactional
    public void syncCreate(final Product product) {
        final Set<ProductCategoryNode> categoryNodes = product.getCategories().stream()
                .map(category -> ProductCategoryNode.builder()
                        .withProductCategoryId(category.getId())
                        .build())
                .collect(Collectors.toSet());
        productCategoryNodeRepository.saveAll(categoryNodes);

        final UserNode seller = UserNode.builder()
                .withUserId(product.getSellerId())
                .build();
        final ProductNode productNode = ProductNode.builder()
                .withProductId(product.getId())
                .withCategories(categoryNodes)
                .withSeller(seller)
                .build();
        productNodeRepository.save(productNode);
    }

    @Transactional
    public void syncUpdate(final Product product) {
        productNodeRepository.findByProductId(product.getId())
                .ifPresent(productNode -> {
                    final Set<ProductCategoryNode> newCategoryNodes = product.getCategories().stream()
                            .map(category -> ProductCategoryNode.builder()
                                    .withProductCategoryId(category.getId())
                                    .build())
                            .collect(Collectors.toSet());

                    productNode.setCategories(newCategoryNodes);
                    productNodeRepository.save(productNode);
                });
    }

    @Transactional
    public void syncDelete(final UUID productId) {
        productNodeRepository.deleteByProductId(productId);
    }
} 