package org.deal.productservice.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.deal.core.dto.ProductDTO;
import org.deal.core.exception.DealError;
import org.deal.core.request.product.CreateProductRequest;
import org.deal.core.request.product.ProductsFilter;
import org.deal.core.request.product.UpdateProductRequest;
import org.deal.core.response.DealResponse;
import org.deal.core.response.PaginationDetails;
import org.deal.core.response.product.ProductDetailsResponse;
import org.deal.productservice.service.ProductService;
import org.deal.productservice.util.PaginationUtils;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public DealResponse<List<ProductDTO>> getProducts(final ProductsFilter filter, final HttpServletRequest request) {
        Page<ProductDTO> page = productService.findAll(filter);
        List<ProductDTO> products = page.getContent();
        var size = Optional.ofNullable(filter.size()).orElse(PaginationDetails.DEFAULT_PAGE_SIZE);

        return DealResponse.successPaginatedResponse(products, PaginationUtils.buildPaginationDetails(page, request, size));
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
