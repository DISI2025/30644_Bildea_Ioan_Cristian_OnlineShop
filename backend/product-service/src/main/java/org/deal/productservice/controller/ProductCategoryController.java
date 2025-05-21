package org.deal.productservice.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.deal.core.dto.ProductCategoryDTO;
import org.deal.core.exception.DealError;
import org.deal.core.request.productcategory.CreateProductCategoryRequest;
import org.deal.core.request.productcategory.GetProductCategoriesRequest;
import org.deal.core.request.productcategory.UpdateProductCategoryRequest;
import org.deal.core.response.DealResponse;
import org.deal.productservice.service.ProductCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.UUID;

import static org.deal.core.util.Constants.ReturnMessages.failedToSave;
import static org.deal.core.util.Constants.ReturnMessages.notFound;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/product-categories")
@RequiredArgsConstructor
@Slf4j
public class ProductCategoryController {

    private final ProductCategoryService productCategoryService;

    @GetMapping
    public DealResponse<Set<ProductCategoryDTO>> getProductCategories() {
        return productCategoryService.findAll()
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(ProductCategoryDTO.class)),
                        HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{id}")
    public DealResponse<ProductCategoryDTO> getProductCategoryById(@PathVariable final UUID id) {
        return productCategoryService.findById(id)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(ProductCategoryDTO.class, "id", id)),
                        NOT_FOUND));
    }

    @PostMapping("/by-ids")
    public DealResponse<Set<ProductCategoryDTO>> getAllCategoriesByIds(final @RequestBody GetProductCategoriesRequest request) {
        return productCategoryService.findAllCategoriesByIds(request.productCategoryIds())
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError("No categories found"), HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public DealResponse<ProductCategoryDTO> create(@RequestBody final CreateProductCategoryRequest request) {
        return productCategoryService.create(request)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(failedToSave(ProductCategoryDTO.class)),
                        BAD_REQUEST));
    }

    @PatchMapping
    public DealResponse<ProductCategoryDTO> update(@RequestBody final UpdateProductCategoryRequest request) {
        return productCategoryService.update(request)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(ProductCategoryDTO.class, "id", request.id())),
                        NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public DealResponse<ProductCategoryDTO> deleteProductCategoryById(@PathVariable final UUID id) {
        return productCategoryService.deleteById(id)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(ProductCategoryDTO.class, "id", id)),
                        NOT_FOUND));
    }
}
