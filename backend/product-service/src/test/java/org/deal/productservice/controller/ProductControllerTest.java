package org.deal.productservice.controller;

import org.deal.core.dto.ProductDTO;
import org.deal.core.exception.DealError;
import org.deal.core.response.product.ProductDetailsResponse;
import org.deal.core.util.Mapper;
import org.deal.productservice.entity.Product;
import org.deal.productservice.service.ProductService;
import org.instancio.Instancio;
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
import static org.deal.productservice.util.TestUtils.ProductUtils.createProductRequest;
import static org.deal.productservice.util.TestUtils.ProductUtils.updateProductRequest;
import static org.deal.productservice.util.TestUtils.ResponseUtils.assertThatResponseFailed;
import static org.deal.productservice.util.TestUtils.ResponseUtils.assertThatResponseIsSuccessful;
import static org.deal.productservice.util.TestUtils.convertAll;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController victim;

    @Test
    void testGetProducts_shouldReturnSuccess() {
        var expectedProducts = List.of(Instancio.create(Product.class), Instancio.create(Product.class));
        when(productService.findAll()).thenReturn(Optional.of(convertAll(expectedProducts, ProductDTO.class)));

        var response = victim.getProducts();

        verify(productService).findAll();
        assertThatResponseIsSuccessful(response, convertAll(expectedProducts, ProductDTO.class));
    }

    @Test
    void testGetProducts_noProductsFound_returnsFailure() {
        when(productService.findAll()).thenReturn(Optional.empty());

        var response = victim.getProducts();

        verify(productService).findAll();
        assertThatResponseFailed(response, List.of(new DealError(notFound(ProductDTO.class))), HttpStatus.NOT_FOUND);
    }

    @Test
    void testGetProductById_productFound_returnsSuccess() {
        var expectedProduct = Instancio.create(Product.class);
        var expectedData = Mapper.mapTo(expectedProduct, ProductDTO.class);
        when(productService.findById(expectedProduct.getId())).thenReturn(Optional.of(expectedData));

        var response = victim.getProductById(expectedProduct.getId());

        verify(productService).findById(expectedProduct.getId());
        assertThatResponseIsSuccessful(response, expectedData);
    }

    @Test
    void testGetProductById_productNotFound_returnsFailure() {
        var id = UUID.randomUUID();
        when(productService.findById(id)).thenReturn(Optional.empty());

        var response = victim.getProductById(id);

        verify(productService).findById(id);
        assertThatResponseFailed(response, List.of(new DealError(notFound(ProductDTO.class, "id", id))), HttpStatus.NOT_FOUND);
    }

    @Test
    void testCreate_productIsCreated_shouldReturnSuccess() {
        var createdProduct = Instancio.create(Product.class);
        var request = createProductRequest(createdProduct);
        var expectedData = Mapper.mapTo(createdProduct, ProductDTO.class);
        when(productService.create(request)).thenReturn(Optional.of(expectedData));

        var response = victim.create(request);

        verify(productService).create(request);
        assertThatResponseIsSuccessful(response, expectedData);
    }

    @Test
    void testCreate_productIsNotCreated_returnsFailure() {
        when(productService.create(any())).thenReturn(Optional.empty());

        var response = victim.create(createProductRequest(Instancio.create(Product.class)));

        verify(productService).create(any());
        assertThatResponseFailed(response, List.of(new DealError(failedToSave(ProductDTO.class))), HttpStatus.BAD_REQUEST);
    }

    @Test
    void testUpdate_productIsUpdated_shouldReturnSuccess() {
        var updatedProduct = Instancio.create(Product.class);
        var request = updateProductRequest(updatedProduct);
        var expectedData = Mapper.mapTo(updatedProduct, ProductDTO.class);
        when(productService.update(request)).thenReturn(Optional.of(expectedData));

        var response = victim.update(request);

        verify(productService).update(request);
        assertThatResponseIsSuccessful(response, expectedData);
    }

    @Test
    void testUpdate_productNotUpdated_returnsFailure() {
        var request = updateProductRequest(Instancio.create(Product.class));
        when(productService.update(request)).thenReturn(Optional.empty());

        var response = victim.update(request);

        verify(productService).update(request);
        assertThatResponseFailed(response, List.of(new DealError(notFound(ProductDTO.class, "id", request.getId()))), HttpStatus.NOT_FOUND);
    }

    @Test
    void testDeleteProductById_productDeleted_shouldReturnSuccess() {
        var product = Instancio.create(Product.class);
        var expectedData = Mapper.mapTo(product, ProductDTO.class);
        when(productService.deleteById(product.getId())).thenReturn(Optional.of(expectedData));

        var response = victim.deleteProductById(product.getId());

        verify(productService).deleteById(product.getId());
        assertThatResponseIsSuccessful(response, expectedData);
    }

    @Test
    void testDeleteProductById_productNotFound_returnsFailure() {
        var id = UUID.randomUUID();
        when(productService.deleteById(id)).thenReturn(Optional.empty());

        var response = victim.deleteProductById(id);

        verify(productService).deleteById(id);
        assertThatResponseFailed(response, List.of(new DealError(notFound(ProductDTO.class, "id", id))), HttpStatus.NOT_FOUND);
    }

    @Test
    void testGetProductsBySellerId_productFound_returnsSuccess() {
        var expectedProducts = List.of(Instancio.create(Product.class), Instancio.create(Product.class));
        var sellerId = UUID.randomUUID();
        when(productService.findAllBySellerId(sellerId)).thenReturn(Optional.of(convertAll(expectedProducts, ProductDTO.class)));

        var response = victim.getProductsBySellerId(sellerId);

        verify(productService).findAllBySellerId(sellerId);
        assertThatResponseIsSuccessful(response, convertAll(expectedProducts, ProductDTO.class));
    }

    @Test
    void testGetProductsBySellerId_productsNotFound_returnsFailure() {
        var sellerId = UUID.randomUUID();
        when(productService.findAllBySellerId(sellerId)).thenReturn(Optional.empty());

        var response = victim.getProductsBySellerId(sellerId);

        verify(productService).findAllBySellerId(sellerId);
        assertThatResponseFailed(response, List.of(new DealError(notFound(ProductDTO.class))), HttpStatus.NOT_FOUND);
    }

    @Test
    void testGetProductDetailsById_productFound_returnsSuccess() {
        var productId = UUID.randomUUID();
        var expectedDetails = mock(ProductDetailsResponse.class);

        when(productService.findDetailsById(productId)).thenReturn(Optional.of(expectedDetails));

        var response = victim.getProductDetailsById(productId);

        verify(productService).findDetailsById(productId);
        assertThatResponseIsSuccessful(response, expectedDetails);
    }

    @Test
    void testGetProductDetailsById_productNotFound_returnsFailure() {
        var id = UUID.randomUUID();

        when(productService.findDetailsById(id)).thenReturn(Optional.empty());

        var response = victim.getProductDetailsById(id);

        verify(productService).findDetailsById(id);
        assertThatResponseFailed(
                response,
                List.of(new DealError(notFound(ProductDTO.class, "id", id))),
                HttpStatus.NOT_FOUND
        );
    }


}