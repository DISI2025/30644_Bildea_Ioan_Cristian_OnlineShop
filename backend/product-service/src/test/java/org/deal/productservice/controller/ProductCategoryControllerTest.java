package org.deal.productservice.controller;

import org.deal.core.dto.ProductCategoryDTO;
import org.deal.core.exception.DealError;
import org.deal.core.util.Mapper;
import org.deal.productservice.service.ProductCategoryService;
import org.deal.productservice.util.BaseUnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.deal.core.util.Constants.ReturnMessages.failedToSave;
import static org.deal.core.util.Constants.ReturnMessages.notFound;
import static org.deal.productservice.util.TestUtils.ProductCategoryUtils.createProductCategoryRequest;
import static org.deal.productservice.util.TestUtils.ProductCategoryUtils.randomProductCategory;
import static org.deal.productservice.util.TestUtils.ProductCategoryUtils.updateProductCategoryRequest;
import static org.deal.productservice.util.TestUtils.ResponseUtils.assertThatResponseFailed;
import static org.deal.productservice.util.TestUtils.ResponseUtils.assertThatResponseIsSuccessful;
import static org.deal.productservice.util.TestUtils.convertAll;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductCategoryControllerTest extends BaseUnitTest {

    @Mock
    private ProductCategoryService productCategoryService;

    @InjectMocks
    private ProductCategoryController victim;

    @Test
    void testGetProductCategories_shouldReturnSuccess() {
        var expectedProductCategories = List.of(randomProductCategory(), randomProductCategory());
        when(productCategoryService.findAll()).thenReturn(Optional.of(convertAll(expectedProductCategories, ProductCategoryDTO.class)));

        var response = victim.getProductCategories();

        verify(productCategoryService).findAll();
        assertThatResponseIsSuccessful(response, convertAll(expectedProductCategories, ProductCategoryDTO.class));
    }

    @Test
    void testGetProductCategories_noProductCategoriesFound_returnsFailure() {
        when(productCategoryService.findAll()).thenReturn(Optional.empty());

        var response = victim.getProductCategories();

        verify(productCategoryService).findAll();
        assertThatResponseFailed(response, List.of(new DealError(notFound(ProductCategoryDTO.class))), HttpStatus.NOT_FOUND);
    }

    @Test
    void testGetProductCategoryById_productCategoryFound_returnsSuccess() {
        var expectedProductCategory = randomProductCategory();
        var expectedData = Mapper.mapTo(expectedProductCategory, ProductCategoryDTO.class);
        when(productCategoryService.findById(expectedProductCategory.getId())).thenReturn(Optional.of(expectedData));

        var response = victim.getProductCategoryById(expectedProductCategory.getId());

        verify(productCategoryService).findById(expectedProductCategory.getId());
        assertThatResponseIsSuccessful(response, expectedData);
    }

    @Test
    void testGetProductCategoryById_productCategoryNotFound_returnsFailure() {
        var id = UUID.randomUUID();
        when(productCategoryService.findById(id)).thenReturn(Optional.empty());

        var response = victim.getProductCategoryById(id);

        verify(productCategoryService).findById(id);
        assertThatResponseFailed(response, List.of(new DealError(notFound(ProductCategoryDTO.class, "id", id))), HttpStatus.NOT_FOUND);
    }

    @Test
    void testCreate_productCategoryIsCreated_shouldReturnSuccess() {
        var createdProductCategory = randomProductCategory();
        var request = createProductCategoryRequest(createdProductCategory);
        var expectedData = Mapper.mapTo(createdProductCategory, ProductCategoryDTO.class);
        when(productCategoryService.create(request)).thenReturn(Optional.of(expectedData));

        var response = victim.create(request);

        verify(productCategoryService).create(request);
        assertThatResponseIsSuccessful(response, expectedData);
    }

    @Test
    void testCreate_productCategoryIsNotCreated_returnsFailure() {
        when(productCategoryService.create(any())).thenReturn(Optional.empty());

        var response = victim.create(createProductCategoryRequest(randomProductCategory()));

        verify(productCategoryService).create(any());
        assertThatResponseFailed(response, List.of(new DealError(failedToSave(ProductCategoryDTO.class))), HttpStatus.BAD_REQUEST);
    }

    @Test
    void testUpdate_productCategoryIsUpdated_shouldReturnSuccess() {
        var updatedProductCategory = randomProductCategory();
        var request = updateProductCategoryRequest(updatedProductCategory);
        var expectedData = Mapper.mapTo(updatedProductCategory, ProductCategoryDTO.class);
        when(productCategoryService.update(request)).thenReturn(Optional.of(expectedData));

        var response = victim.update(request);

        verify(productCategoryService).update(request);
        assertThatResponseIsSuccessful(response, expectedData);
    }

    @Test
    void testUpdate_productCategoryNotUpdated_returnsFailure() {
        var request = updateProductCategoryRequest(randomProductCategory());
        when(productCategoryService.update(request)).thenReturn(Optional.empty());

        var response = victim.update(request);

        verify(productCategoryService).update(request);
        assertThatResponseFailed(response, List.of(new DealError(notFound(ProductCategoryDTO.class, "id", request.id()))), HttpStatus.NOT_FOUND);
    }


    @Test
    void testDeleteProductCategoryById_productCategoryDeleted_shouldReturnSuccess() {
        var productCategory = randomProductCategory();
        var expectedData = Mapper.mapTo(productCategory, ProductCategoryDTO.class);
        when(productCategoryService.deleteById(productCategory.getId())).thenReturn(Optional.of(expectedData));

        var response = victim.deleteProductCategoryById(productCategory.getId());

        verify(productCategoryService).deleteById(productCategory.getId());
        assertThatResponseIsSuccessful(response, expectedData);
    }

    @Test
    void testDeleteProductCategoryById_productCategoryNotFound_returnsFailure() {
        var id = UUID.randomUUID();
        when(productCategoryService.deleteById(id)).thenReturn(Optional.empty());

        var response = victim.deleteProductCategoryById(id);

        verify(productCategoryService).deleteById(id);
        assertThatResponseFailed(response, List.of(new DealError(notFound(ProductCategoryDTO.class, "id", id))), HttpStatus.NOT_FOUND);
    }
}