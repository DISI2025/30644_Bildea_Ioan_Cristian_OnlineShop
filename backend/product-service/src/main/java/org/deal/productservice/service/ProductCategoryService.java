package org.deal.productservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.ProductCategoryDTO;
import org.deal.core.request.productcategory.CreateProductCategoryRequest;
import org.deal.core.request.productcategory.UpdateProductCategoryRequest;
import org.deal.core.util.Mapper;
import org.deal.productservice.entity.ProductCategory;
import org.deal.productservice.repository.ProductCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;

    public Optional<List<ProductCategoryDTO>> findAll() {
        return Optional.of(productCategoryRepository.findAll().stream().map(this::mapToDTO).toList());
    }

    public Optional<ProductCategoryDTO> findById(final UUID id) {
        return productCategoryRepository.findById(id).map(this::mapToDTO);
    }

    public Optional<ProductCategoryDTO> create(final CreateProductCategoryRequest request) {
        var productCategory = productCategoryRepository.save(
                ProductCategory.builder()
                        .withCategoryName(request.categoryName())
                        .build()
        );

        return Optional.of(mapToDTO(productCategory));
    }

    public Optional<ProductCategoryDTO> update(final UpdateProductCategoryRequest request) {
        return productCategoryRepository.findById(request.id())
                .map(productCategory -> {
                    Mapper.updateValues(productCategory, request);
                    productCategoryRepository.save(productCategory);

                    return mapToDTO(productCategory);
                });
    }

    public Optional<ProductCategoryDTO> deleteById(final UUID id) {
        return productCategoryRepository.findById(id)
                .filter(__ -> productCategoryRepository.deleteByIdReturning(id) != 0)
                .map(this::mapToDTO);
    }

    public ProductCategoryDTO mapToDTO(final ProductCategory productCategory) {
        return Mapper.mapTo(productCategory, ProductCategoryDTO.class);
    }
}
