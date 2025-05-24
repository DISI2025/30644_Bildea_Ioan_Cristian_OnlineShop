package org.deal.productservice.service;

import org.deal.core.client.DealClient;
import org.deal.core.client.DealService;
import org.deal.core.dto.ProductDTO;
import org.deal.core.dto.UserDTO;
import org.deal.core.request.auth.ValidateTokenRequest;
import org.deal.core.util.Mapper;
import org.deal.productservice.entity.Product;
import org.deal.productservice.enums.SortOption;
import org.deal.productservice.repository.ProductCategoryRepository;
import org.deal.productservice.repository.ProductRepository;
import org.deal.productservice.security.DealContext;
import org.deal.productservice.util.BaseUnitTest;
import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.deal.productservice.util.TestUtils.ProductUtils.createProductRequest;
import static org.deal.productservice.util.TestUtils.ProductUtils.updateProductRequest;
import static org.deal.productservice.util.TestUtils.convertAll;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.junit.jupiter.api.Assertions.assertTrue;
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

    @Mock
    private DealClient dealClient;

    @Mock
    private DealContext dealContext;


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

    @Test
    void testFindDetailsById_productFound_returnsProductDetailsResponse() {
        // Arrange
        var product = Instancio.create(Product.class);
        var productDTO = Mapper.mapTo(product, ProductDTO.class);
        var jwtToken = "Bearer token.jwt.test";

        var userDTO = Instancio.create(UserDTO.class);

        when(productRepository.findById(product.getId())).thenReturn(Optional.of(product));
        when(dealContext.getToken()).thenReturn(jwtToken);
        when(dealClient.call(
                DealService.IS,
                "/auth/validate-token",
                HttpMethod.POST,
                new ValidateTokenRequest(jwtToken),
                UserDTO.class
        )).thenReturn(userDTO);

        // Act
        var result = victim.findDetailsById(product.getId());

        // Assert
        verify(productRepository).findById(product.getId());
        verify(dealContext).getToken();
        verify(dealClient).call(
                DealService.IS,
                "/auth/validate-token",
                HttpMethod.POST,
                new ValidateTokenRequest(jwtToken),
                UserDTO.class
        );

        result.ifPresentOrElse(
                details -> {
                    assertThat(details.id(), equalTo(productDTO.id()));
                    assertThat(details.title(), equalTo(productDTO.title()));
                    assertThat(details.sellerDTO(), equalTo(userDTO));
                },
                this::assertThatFails
        );
    }

    @Test
    void testFindDetailsById_productNotFound_returnsEmptyOptional() {
        // Arrange
        var id = UUID.randomUUID();
        when(productRepository.findById(id)).thenReturn(Optional.empty());

        // Act
        var result = victim.findDetailsById(id);

        // Assert
        verify(productRepository).findById(id);
        verify(dealContext, never()).getToken();
        verify(dealClient, never()).call(any(), any(), any(), any(), any());

        assertTrue(result.isEmpty());
    }

    @Test
    void testFindAll_withNameFilter_shouldReturnFilteredProducts() {
        var product = Instancio.create(Product.class);
        String name = "banana";

        when(productRepository.findWithFilter(name, null)).thenReturn(List.of(product));

        var result = victim.findAll(name, null, SortOption.NONE);

        verify(productRepository).findWithFilter(name, null);
        result.ifPresentOrElse(products -> {
            assertThat(products, hasItem(Mapper.mapTo(product, ProductDTO.class)));
        }, this::assertThatFails);
    }

    @Test
    void testFindAll_withCategoryFilter_shouldReturnFilteredProducts() {
        var product = Instancio.create(Product.class);
        UUID categoryId = UUID.randomUUID();

        when(productRepository.findWithFilter(null, categoryId)).thenReturn(List.of(product));

        var result = victim.findAll(null, categoryId, SortOption.NONE);

        verify(productRepository).findWithFilter(null, categoryId);
        result.ifPresentOrElse(products -> {
            assertThat(products, hasItem(Mapper.mapTo(product, ProductDTO.class)));
        }, this::assertThatFails);
    }

    @Test
    void testFindAll_withAllFilters_shouldReturnSortedProducts() {
        var product1 = Instancio.create(Product.class);
        var product2 = Instancio.create(Product.class);

        String name = "apple";
        UUID categoryId = UUID.randomUUID();
        SortOption sortOption = SortOption.Z_TO_A;

        when(productRepository.findWithFilter(name, categoryId)).thenReturn(List.of(product1, product2));

        var result = victim.findAll(name, categoryId, sortOption);

        verify(productRepository).findWithFilter(name, categoryId);
        result.ifPresentOrElse(products -> {
            var dtos = convertAll(List.of(product1, product2), ProductDTO.class);
            var sorted = dtos.stream()
                    .sorted((p1, p2) -> p2.title().compareTo(p1.title()))
                    .toList();
            assertThat(products, equalTo(sorted));
        }, this::assertThatFails);
    }

    @Test
    void testFindAll_withSortOptionAtoZ_shouldReturnSortedAscending() {
        var product1 = Instancio.create(Product.class);
        var product2 = Instancio.create(Product.class);

        product1.setTitle("Apple");
        product2.setTitle("Banana");

        when(productRepository.findWithFilter(null, null)).thenReturn(List.of(product2, product1));

        var result = victim.findAll(null, null, SortOption.A_TO_Z);

        verify(productRepository).findWithFilter(null, null);
        result.ifPresentOrElse(products -> {
            var dtos = convertAll(List.of(product2, product1), ProductDTO.class);
            var sorted = dtos.stream()
                    .sorted((p1, p2) -> p1.title().compareTo(p2.title()))
                    .toList();
            assertThat(products, equalTo(sorted));
        }, this::assertThatFails);
    }

}