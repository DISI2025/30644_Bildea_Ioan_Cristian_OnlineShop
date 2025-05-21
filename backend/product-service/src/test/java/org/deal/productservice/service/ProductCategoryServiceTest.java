package org.deal.productservice.service;

import org.deal.core.dto.ProductCategoryDTO;
import org.deal.core.util.Mapper;
import org.deal.productservice.entity.ProductCategory;
import org.deal.productservice.repository.ProductCategoryRepository;
import org.deal.productservice.util.BaseUnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.deal.productservice.util.TestUtils.ProductCategoryUtils.createProductCategoryRequest;
import static org.deal.productservice.util.TestUtils.ProductCategoryUtils.randomProductCategory;
import static org.deal.productservice.util.TestUtils.ProductCategoryUtils.updateProductCategoryRequest;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductCategoryServiceTest extends BaseUnitTest {

    @Mock
    private ProductCategoryRepository productCategoryRepository;

    @InjectMocks
    private ProductCategoryService victim;

    @Test
    void testFindAll_shouldReturnValidProductCategoryData() {
        var productCategory = randomProductCategory();
        when(productCategoryRepository.findAll()).thenReturn(List.of(productCategory));

        var result = victim.findAll();

        verify(productCategoryRepository).findAll();
        result.ifPresentOrElse(
                productCategorysList -> assertThat(productCategorysList, hasItem(Mapper.mapTo(productCategory, ProductCategoryDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testFindAll_emptyData_returnsSuccess() {
        when(productCategoryRepository.findAll()).thenReturn(List.of());

        var result = victim.findAll();

        verify(productCategoryRepository).findAll();
        result.ifPresentOrElse(
                productCategories -> assertThat(productCategories, equalTo(Set.of())),
                this::assertThatFails
        );
    }

    @Test
    void testFindById_shouldReturnValidProductCategoryData() {
        var expectedProductCategory = randomProductCategory();
        when(productCategoryRepository.findById(expectedProductCategory.getId())).thenReturn(Optional.of(expectedProductCategory));

        var result = victim.findById(expectedProductCategory.getId());

        verify(productCategoryRepository).findById(expectedProductCategory.getId());
        result.ifPresentOrElse(
                productCategory -> assertThat(productCategory, equalTo(Mapper.mapTo(expectedProductCategory, ProductCategoryDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testFindById_productCategoryNotFound_returnsEmptyOptional() {
        when(productCategoryRepository.findById(any())).thenReturn(Optional.empty());

        var result = victim.findById(UUID.randomUUID());

        verify(productCategoryRepository).findById(any());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testCreate_productCategoryIsCreated_shouldReturnCreatedProductCategory() {
        var expectedProductCategory = prepareProductCategoryBuilder();

        var result = victim.create(createProductCategoryRequest(expectedProductCategory));

        verify(productCategoryRepository).save(expectedProductCategory);
        result.ifPresentOrElse(
                productCategory -> assertThat(productCategory, equalTo(Mapper.mapTo(expectedProductCategory, ProductCategoryDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testUpdate_productCategoryIsFound_shouldReturnUpdatedProductCategory() {
        var initialProductCategory = randomProductCategory();
        var updatedProductCategory = randomProductCategory();
        updatedProductCategory.setId(initialProductCategory.getId());
        updatedProductCategory.setCategoryName(initialProductCategory.getCategoryName());
        when(productCategoryRepository.findById(initialProductCategory.getId())).thenReturn(Optional.of(initialProductCategory));

        var result = victim.update(updateProductCategoryRequest(updatedProductCategory));

        verify(productCategoryRepository).findById(initialProductCategory.getId());
        verify(productCategoryRepository).save(initialProductCategory);
        result.ifPresentOrElse(
                productCategory -> assertThat(productCategory, equalTo(Mapper.mapTo(updatedProductCategory, ProductCategoryDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testUpdate_productCategoryIsNotFound_returnsEmptyOptional() {
        when(productCategoryRepository.findById(any())).thenReturn(Optional.empty());

        var result = victim.update(updateProductCategoryRequest(randomProductCategory()));

        verify(productCategoryRepository).findById(any());
        verify(productCategoryRepository, never()).save(any());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testDelete_productCategoryIsFound_shouldReturnDeletedProductCategory() {
        var productCategory = randomProductCategory();
        when(productCategoryRepository.findById(productCategory.getId())).thenReturn(Optional.of(productCategory));
        when(productCategoryRepository.deleteByIdReturning(productCategory.getId())).thenReturn(1);

        var result = victim.deleteById(productCategory.getId());

        verify(productCategoryRepository).findById(productCategory.getId());
        verify(productCategoryRepository).deleteByIdReturning(productCategory.getId());
        result.ifPresentOrElse(
                deletedProductCategory -> assertThat(deletedProductCategory, equalTo(Mapper.mapTo(productCategory, ProductCategoryDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testDelete_productCategoryIsNotFound_returnsEmptyOptional() {
        when(productCategoryRepository.findById(any())).thenReturn(Optional.empty());

        var result = victim.deleteById(UUID.randomUUID());

        verify(productCategoryRepository).findById(any());
        verify(productCategoryRepository, never()).deleteByIdReturning(any());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testDelete_productCategoryIsNotDeleted_returnsEmptyOptional() {
        var productCategory = randomProductCategory();
        when(productCategoryRepository.findById(any())).thenReturn(Optional.of(productCategory));
        when(productCategoryRepository.deleteByIdReturning(productCategory.getId())).thenReturn(0);

        var result = victim.deleteById(productCategory.getId());

        verify(productCategoryRepository).findById(any());
        verify(productCategoryRepository).deleteByIdReturning(productCategory.getId());
        result.ifPresent(this::assertThatFails);
    }


    private ProductCategory prepareProductCategoryBuilder() {
        ProductCategory.ProductCategoryBuilder builderMock = mock(ProductCategory.ProductCategoryBuilder.class);

        ProductCategory expectedProductCategory = randomProductCategory();

        when(builderMock.withCategoryName(anyString())).thenReturn(builderMock);
        when(builderMock.build()).thenReturn(expectedProductCategory);

        mockStatic(ProductCategory.class).when(ProductCategory::builder).thenReturn(builderMock);

        when(productCategoryRepository.save(any(ProductCategory.class))).thenReturn(expectedProductCategory);

        return expectedProductCategory;
    }


}