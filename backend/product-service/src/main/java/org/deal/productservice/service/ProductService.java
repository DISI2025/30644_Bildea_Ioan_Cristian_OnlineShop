package org.deal.productservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.client.DealClient;
import org.deal.core.client.DealService;
import org.deal.core.dto.ProductDTO;
import org.deal.core.dto.UserDTO;
import org.deal.core.exception.DealException;
import org.deal.core.request.auth.ValidateTokenRequest;
import org.deal.core.request.product.CreateProductRequest;
import org.deal.core.request.product.UpdateProductRequest;
import org.deal.core.response.product.ProductDetailsResponse;
import org.deal.core.util.Mapper;
import org.deal.productservice.entity.Product;
import org.deal.productservice.entity.ProductCategory;
import org.deal.productservice.repository.ProductCategoryRepository;
import org.deal.productservice.repository.ProductRepository;
import org.deal.productservice.security.DealContext;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

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
    private final DealClient dealClient;
    private final DealContext dealContext;

    public Optional<List<ProductDTO>> findAll() {
        return Optional.of(productRepository.findAll().stream().map(this::mapToDTO).toList());
    }

    public Optional<List<ProductDTO>> findAllBySellerId(final UUID sellerId) {
        return Optional.of(productRepository.findAllBySellerId(sellerId).stream().map(this::mapToDTO).toList());
    }

    public Optional<ProductDTO> findById(final UUID id) {
        return productRepository.findById(id).map(this::mapToDTO);
    }

    public Optional<ProductDetailsResponse> findDetailsById(final UUID id) {
        Optional<ProductDTO> productDTO = productRepository.findById(id).map(this::mapToDTO);
        if(productDTO.isEmpty()) {
            return Optional.empty();
        }

        String jwtToken = dealContext.getToken();

        try {
            UserDTO userDTO = dealClient.call(DealService.IS, "/auth/validate-token", HttpMethod.POST, new ValidateTokenRequest(jwtToken), UserDTO.class);

            ProductDetailsResponse productDetailsResponse = ProductDetailsResponse.builder()
                    .withId(productDTO.get().id())
                    .withTitle(productDTO.get().title())
                    .withDescription(productDTO.get().description())
                    .withPrice(productDTO.get().price())
                    .withStock(productDTO.get().stock())
                    .withImageUrl(productDTO.get().imageUrl())
                    .withCategories(productDTO.get().categories())
                    .withCreatedAt(productDTO.get().createdAt())
                    .withSellerDTO(userDTO)
                    .build();

            return Optional.of(productDetailsResponse);

        } catch (DealException e) {
          return Optional.empty();
        }
    }

    public Optional<ProductDTO> create(final CreateProductRequest request) {
        var product = productRepository.save(
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

        return Optional.of(mapToDTO(product));
    }

    public Optional<ProductDTO> update(final UpdateProductRequest request) {
        return productRepository.findById(request.getId())
                .map(user -> {
                    if (Objects.nonNull(request.getCategories())) {
                        Set<ProductCategory> newCategories = productCategoryRepository.findAllByName(request.getCategories());
                        request.setCategories(null);
                        user.setCategories(newCategories);
                    }

                    Mapper.updateValues(user, request);
                    productRepository.save(user);

                    return mapToDTO(user);
                });
    }

    public Optional<ProductDTO> deleteById(final UUID id) {
        return productRepository.findById(id)
                .filter(__ -> productRepository.deleteByIdReturning(id) != 0)
                .map(this::mapToDTO);
    }

    private ProductDTO mapToDTO(final Product product) {
        return Mapper.mapTo(product, ProductDTO.class);
    }
}
