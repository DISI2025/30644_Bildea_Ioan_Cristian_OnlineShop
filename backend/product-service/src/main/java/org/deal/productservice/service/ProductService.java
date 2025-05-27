package org.deal.productservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.ProductDTO;
import org.deal.core.request.product.CreateProductRequest;
import org.deal.core.request.product.ProductsFilter;
import org.deal.core.request.product.UpdateProductRequest;
import org.deal.core.response.product.ProductDetailsResponse;
import org.deal.core.util.Mapper;
import org.deal.productservice.entity.Product;
import org.deal.productservice.entity.ProductCategory;
import org.deal.productservice.repository.ProductCategoryRepository;
import org.deal.productservice.repository.ProductRepository;
import org.deal.productservice.security.DealContext;
import org.deal.productservice.util.PaginationUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final ProductSyncService productSyncService;
    private final DealContext dealContext;

    public Optional<ProductDTO> findById(final UUID id) {
        return productRepository.findById(id).map(this::mapToDTO);
    }

    public Optional<List<ProductDTO>> findAll() {
        return Optional.of(productRepository.findAll().stream().map(this::mapToDTO).toList());
    }

    public Optional<List<ProductDTO>> findAllBySellerId(final UUID sellerId) {
        return Optional.of(productRepository.findAllBySellerId(sellerId).stream().map(this::mapToDTO).toList());
    }

    public Page<ProductDTO> findAll(final ProductsFilter filter) {
        final Specification<Product> specification = PaginationUtils.buildSpecification(filter);
        final Pageable pageable = PaginationUtils.buildPageableRequest(filter);

        return productRepository.findAll(specification, pageable).map(this::mapToDTO);
    }

    public Optional<ProductDetailsResponse> findDetailsById(final UUID id) {
        Optional<ProductDTO> productDTO = productRepository.findById(id).map(this::mapToDTO);
        if (productDTO.isEmpty()) {
            return Optional.empty();
        }

        ProductDetailsResponse productDetailsResponse = ProductDetailsResponse.builder()
                .withId(productDTO.get().id())
                .withTitle(productDTO.get().title())
                .withDescription(productDTO.get().description())
                .withPrice(productDTO.get().price())
                .withStock(productDTO.get().stock())
                .withImageUrl(productDTO.get().imageUrl())
                .withCategories(productDTO.get().categories())
                .withCreatedAt(productDTO.get().createdAt())
                .withSellerDTO(dealContext.getUser())
                .build();

        return Optional.of(productDetailsResponse);
    }

    public Optional<ProductDTO> create(final CreateProductRequest request) {
        final Product product = productRepository.save(
                Product.builder()
                        .withTitle(request.title())
                        .withDescription(request.description())
                        .withPrice(request.price())
                        .withStock(request.stock())
                        .withImageUrl(request.imageUrl())
                        .withCategories(productCategoryRepository.findAllByName(request.categories()))
                        .withSellerId(UUID.fromString(request.sellerId()))
                        .build()
        );

        productSyncService.syncCreate(product);
        return Optional.of(mapToDTO(product));
    }

    public Optional<ProductDTO> update(final UpdateProductRequest request) {
        return productRepository.findById(request.getId())
                .map(product -> {
                    if (Objects.nonNull(request.getCategories())) {
                        Set<ProductCategory> newCategories = productCategoryRepository.findAllByName(request.getCategories());
                        request.setCategories(null);
                        product.setCategories(newCategories);
                        productSyncService.syncUpdate(product);
                    }

                    Mapper.updateValues(product, request);
                    final Product updatedProduct = productRepository.save(product);
                    return mapToDTO(updatedProduct);
                });
    }

    @Transactional
    public Optional<ProductDTO> deleteById(final UUID id) {
        return productRepository.findById(id)
                .filter(__ -> productRepository.deleteByIdReturning(id) != 0)
                .map(product -> {
                    productSyncService.syncDelete(id);
                    return mapToDTO(product);
                });
    }

    private ProductDTO mapToDTO(final Product product) {
        return Mapper.mapTo(product, ProductDTO.class);
    }
}
