package org.deal.productservice.controller;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.ProductDTO;
import org.deal.core.exception.DealError;
import org.deal.core.request.product.CreateProductRequest;
import org.deal.core.request.product.UpdateProductRequest;
import org.deal.core.response.DealResponse;
import org.deal.core.response.product.ProductDetailsResponse;
import org.deal.productservice.enums.SortOption;
import org.deal.productservice.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.deal.core.util.Constants.ReturnMessages.failedToSave;
import static org.deal.core.util.Constants.ReturnMessages.notFound;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public DealResponse<List<ProductDTO>> getProducts(
            @RequestParam(required = false) final UUID productCategoryId,
            @RequestParam(required = false) final String productName,
            @RequestParam(required = false, defaultValue = "NONE") final SortOption sortOption
    ) {
        Optional<List<ProductDTO>> result;

        if(productName != null || productCategoryId != null || sortOption != null) {
            result = productService.findAll(productName, productCategoryId, sortOption);
        } else {
            result = productService.findAll();
        }

        return result
                .map(DealResponse::successResponse)
                .orElseGet(() -> DealResponse.failureResponse(
                        new DealError(notFound(ProductDTO.class)),
                        HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{id}")
    public DealResponse<ProductDTO> getProductById(@PathVariable final UUID id) {
        return productService.findById(id)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(ProductDTO.class, "id", id)),
                        NOT_FOUND));
    }

    @GetMapping("/details/{id}")
    public DealResponse<ProductDetailsResponse> getProductDetailsById(@PathVariable final UUID id) {
        return productService.findDetailsById(id)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(ProductDTO.class, "id", id)),
                        NOT_FOUND));
    }

    @GetMapping("/seller")
    public DealResponse<List<ProductDTO>> getProductsBySellerId(@RequestParam final UUID id) {
        return productService.findAllBySellerId(id)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(ProductDTO.class)),
                        HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public DealResponse<ProductDTO> create(@RequestBody final CreateProductRequest request) {
        return productService.create(request)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(failedToSave(ProductDTO.class)),
                        BAD_REQUEST));
    }

    @PatchMapping
    public DealResponse<ProductDTO> update(@RequestBody final UpdateProductRequest request) {
        return productService.update(request)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(ProductDTO.class, "id", request.getId())),
                        NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public DealResponse<ProductDTO> deleteProductById(@PathVariable final UUID id) {
        return productService.deleteById(id)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(ProductDTO.class, "id", id)),
                        NOT_FOUND));
    }
}
