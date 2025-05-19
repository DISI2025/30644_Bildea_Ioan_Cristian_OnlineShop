package org.deal.productservice.service;

import org.deal.core.dto.ProductDTO;
import org.deal.core.util.Mapper;
import org.deal.productservice.entity.Product;
import org.deal.productservice.repository.ProductCategoryRepository;
import org.deal.productservice.repository.ProductRepository;
import org.deal.productservice.util.BaseUnitTest;
import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.deal.productservice.util.TestUtils.ProductUtils.createProductRequest;
import static org.deal.productservice.util.TestUtils.ProductUtils.updateProductRequest;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest extends BaseUnitTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductCategoryRepository productCategoryRepository;

    @InjectMocks
    private ProductService victim;

    @Test
    void testFindAll_shouldReturnValidProductData() {
        var product = Instancio.create(Product.class);
        when(productRepository.findAll()).thenReturn(List.of(product));

        var result = victim.findAll();

        verify(productRepository).findAll();
        result.ifPresentOrElse(
                productList -> assertThat(productList, hasItem(Mapper.mapTo(product, ProductDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testFindAll_emptyData_returnsSuccess() {
        when(productRepository.findAll()).thenReturn(List.of());

        var result = victim.findAll();

        verify(productRepository).findAll();
        result.ifPresentOrElse(
                productList -> assertThat(productList, equalTo(List.of())),
                this::assertThatFails
        );
    }

    @Test
    void testFindById_shouldReturnValidProductData() {
        var expectedProduct = Instancio.create(Product.class);
        when(productRepository.findById(expectedProduct.getId())).thenReturn(Optional.of(expectedProduct));

        var result = victim.findById(expectedProduct.getId());

        verify(productRepository).findById(expectedProduct.getId());
        result.ifPresentOrElse(
                product -> assertThat(product, equalTo(Mapper.mapTo(expectedProduct, ProductDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testFindById_productNotFound_returnsEmptyOptional() {
        when(productRepository.findById(any())).thenReturn(Optional.empty());

        var result = victim.findById(UUID.randomUUID());

        verify(productRepository).findById(any());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testCreate_productIsCreated_shouldReturnCreatedProduct() {
        var expectedProduct = Instancio.create(Product.class);

        Product.ProductBuilder builderMock = mock(Product.ProductBuilder.class);
        when(builderMock.withTitle(expectedProduct.getTitle())).thenReturn(builderMock);
        when(builderMock.withDescription(expectedProduct.getDescription())).thenReturn(builderMock);
        when(builderMock.withPrice(expectedProduct.getPrice())).thenReturn(builderMock);
        when(builderMock.withStock(expectedProduct.getStock())).thenReturn(builderMock);
        when(builderMock.withImageUrl(expectedProduct.getImageUrl())).thenReturn(builderMock);
        when(builderMock.withCategories(expectedProduct.getCategories())).thenReturn(builderMock);
        when(builderMock.withSellerId(expectedProduct.getSellerId())).thenReturn(builderMock);
        when(builderMock.build()).thenReturn(expectedProduct);

        when(productRepository.save(expectedProduct)).thenReturn(expectedProduct);
        when(productCategoryRepository.findAllByName(anySet())).thenReturn(expectedProduct.getCategories());

        try (var mockedStatic = mockStatic(Product.class)) {
            mockedStatic.when(Product::builder).thenReturn(builderMock);

            var result = victim.create(createProductRequest(expectedProduct));

            verify(productRepository).save(expectedProduct);
            result.ifPresentOrElse(
                    product -> assertThat(product, equalTo(Mapper.mapTo(expectedProduct, ProductDTO.class))),
                    this::assertThatFails
            );
        }
    }

    @Test
    void testUpdate_productIsFound_shouldReturnUpdatedUser() {
        var initialProduct = Instancio.create(Product.class);
        var updatedProduct = Instancio.create(Product.class);
        updatedProduct.setId(initialProduct.getId());
        updatedProduct.setImageUrl(initialProduct.getImageUrl());
        updatedProduct.setCategories(Set.of());
        updatedProduct.setCreatedAt(initialProduct.getCreatedAt());
        updatedProduct.setSellerId(initialProduct.getSellerId());
        when(productRepository.findById(initialProduct.getId())).thenReturn(Optional.of(initialProduct));

        var result = victim.update(updateProductRequest(updatedProduct));

        verify(productRepository).findById(initialProduct.getId());
        verify(productRepository).save(initialProduct);
        result.ifPresentOrElse(
                product -> assertThat(product, equalTo(Mapper.mapTo(updatedProduct, ProductDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testUpdate_productIsNotFound_returnsEmptyOptional() {
        when(productRepository.findById(any())).thenReturn(Optional.empty());

        var result = victim.update(updateProductRequest(Instancio.create(Product.class)));

        verify(productRepository).findById(any());
        verify(productRepository, never()).save(any());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testDelete_productIsFound_shouldReturnDeletedUser() {
        var product = Instancio.create(Product.class);
        when(productRepository.findById(product.getId())).thenReturn(Optional.of(product));
        when(productRepository.deleteByIdReturning(product.getId())).thenReturn(1);

        var result = victim.deleteById(product.getId());

        verify(productRepository).findById(product.getId());
        verify(productRepository).deleteByIdReturning(product.getId());
        result.ifPresentOrElse(
                deletedProduct -> assertThat(deletedProduct, equalTo(Mapper.mapTo(product, ProductDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testDelete_productIsNotFound_returnsEmptyOptional() {
        when(productRepository.findById(any())).thenReturn(Optional.empty());

        var result = victim.deleteById(UUID.randomUUID());

        verify(productRepository).findById(any());
        verify(productRepository, never()).deleteByIdReturning(any());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testDelete_productIsNotDeleted_returnsEmptyOptional() {
        var product = Instancio.create(Product.class);
        when(productRepository.findById(any())).thenReturn(Optional.of(product));
        when(productRepository.deleteByIdReturning(product.getId())).thenReturn(0);

        var result = victim.deleteById(product.getId());

        verify(productRepository).findById(any());
        verify(productRepository).deleteByIdReturning(product.getId());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testFindAllBySellerId_productsFound_shouldReturnAllProducts() {
        var product = Instancio.create(Product.class);
        when(productRepository.findAllBySellerId(product.getSellerId())).thenReturn(List.of(product));

        var result = victim.findAllBySellerId(product.getSellerId());

        verify(productRepository).findAllBySellerId(product.getSellerId());
        result.ifPresentOrElse(
                productList -> assertThat(productList, hasItem(Mapper.mapTo(product, ProductDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testFindAllBySellerId_productsNotFound_shouldReturnEmptyData() {
        UUID sellerId = UUID.randomUUID();
        when(productRepository.findAllBySellerId(any())).thenReturn(List.of());

        var result = victim.findAllBySellerId(sellerId);

        verify(productRepository).findAllBySellerId(sellerId);
        result.ifPresentOrElse(
                productList -> assertThat(productList, equalTo(List.of())),
                this::assertThatFails
        );
    }
}