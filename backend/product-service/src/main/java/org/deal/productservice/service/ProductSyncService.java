package org.deal.productservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.productservice.entity.Product;
import org.deal.productservice.entity.ProductCategoryNode;
import org.deal.productservice.entity.ProductNode;
import org.deal.productservice.entity.UserNode;
import org.deal.productservice.repository.ProductCategoryNodeRepository;
import org.deal.productservice.repository.ProductNodeRepository;
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
                        .withId(category.getId())
                        .withCategoryName(category.getCategoryName())
                        .build())
                .collect(Collectors.toSet());

        productCategoryNodeRepository.saveAll(categoryNodes);

        final UserNode seller = UserNode.builder()
                .withId(product.getSellerId())
                .build();

        final ProductNode productNode = ProductNode.builder()
                .withId(product.getId())
                .withTitle(product.getTitle())
                .withDescription(product.getDescription())
                .withPrice(product.getPrice())
                .withStock(product.getStock())
                .withImageUrl(product.getImageUrl())
                .withCreatedAt(product.getCreatedAt())
                .withCategories(categoryNodes)
                .withSeller(seller)
                .build();

        productNodeRepository.save(productNode);
    }

    @Transactional
    public void syncUpdate(final Product product) {
        productNodeRepository.findById(product.getId())
                .ifPresent(productNode -> {
                    final Set<ProductCategoryNode> categoryNodes = product.getCategories().stream()
                            .map(category -> ProductCategoryNode.builder()
                                    .withId(category.getId())
                                    .withCategoryName(category.getCategoryName())
                                    .build())
                            .collect(Collectors.toSet());

                    productCategoryNodeRepository.saveAll(categoryNodes);

                    productNode.setTitle(product.getTitle());
                    productNode.setDescription(product.getDescription());
                    productNode.setPrice(product.getPrice());
                    productNode.setStock(product.getStock());
                    productNode.setImageUrl(product.getImageUrl());
                    productNode.setCategories(categoryNodes);

                    productNodeRepository.save(productNode);
                });
    }

    @Transactional
    public void syncDelete(final UUID productId) {
        productNodeRepository.deleteById(productId);
    }
} 