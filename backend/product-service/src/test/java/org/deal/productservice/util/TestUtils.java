package org.deal.productservice.util;

import org.deal.core.dto.ProductCategoryDTO;
import org.deal.core.exception.DealError;
import org.deal.core.request.order.CreateOrderRequest;
import org.deal.core.request.product.CreateProductRequest;
import org.deal.core.request.product.UpdateProductRequest;
import org.deal.core.request.productcategory.CreateProductCategoryRequest;
import org.deal.core.request.productcategory.UpdateProductCategoryRequest;
import org.deal.core.response.DealResponse;
import org.deal.core.util.Mapper;
import org.deal.productservice.entity.Order;
import org.deal.productservice.entity.Product;
import org.deal.productservice.entity.ProductCategory;
import org.junit.jupiter.api.Assertions;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.deal.core.util.Constants.FAILURE;
import static org.deal.core.util.Constants.SUCCESS;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

public class TestUtils {

    public static String randomString() {
        return UUID.randomUUID().toString().replaceAll("_", "");
    }

    public static <T, U> List<U> convertAll(final List<T> data, final Class<U> clazz) {
        return data.stream().map(element -> Mapper.mapTo(element, clazz)).toList();
    }
    public static <T, U> Set<U> convertAll(final Set<T> data, final Class<U> clazz) {
        return data.stream().map(element -> Mapper.mapTo(element, clazz)).collect(Collectors.toSet());
    }

    public interface ResponseUtils {
        static <T> void assertThatResponseIsSuccessful(final DealResponse<T> response, final T expectedData) {
            Optional.ofNullable(response.getBody().get("payload")).ifPresentOrElse(
                    payload -> {
                        assertThat(payload, equalTo(expectedData));
                        assertThat(response.getStatus(), equalTo(HttpStatus.OK));
                        assertThat(response.getMessage(), equalTo(SUCCESS));
                    },
                    Assertions::fail
            );
        }

        static void assertThatResponseFailed(
                final DealResponse<?> response,
                final List<DealError> expectedErrors,
                final HttpStatus expectedStatus) {
            Optional.ofNullable(response.getBody().get("errors")).ifPresentOrElse(
                    errors -> {
                        assertThat(errors, equalTo(expectedErrors));
                        assertThat(response.getStatus(), equalTo(expectedStatus));
                        assertThat(response.getMessage(), equalTo(FAILURE));
                    },
                    Assertions::fail
            );
        }
    }

    public interface ProductCategoryUtils {
        static ProductCategory randomProductCategory() {
            return new ProductCategory(UUID.randomUUID(), randomString());
        }

        static ProductCategoryDTO randomProductCategoryDTO() {
            return new ProductCategoryDTO(UUID.randomUUID(), randomString());
        }

        static CreateProductCategoryRequest createProductCategoryRequest(final ProductCategory productCategory) {
            return new CreateProductCategoryRequest(
                    productCategory.getCategoryName()
            );
        }

        static UpdateProductCategoryRequest updateProductCategoryRequest(final ProductCategory productCategory) {
            return new UpdateProductCategoryRequest(
                    productCategory.getId(),
                    productCategory.getCategoryName()
            );
        }
    }

    public interface ProductUtils {
        static CreateProductRequest createProductRequest(final Product product) {
            return new CreateProductRequest(
                    product.getTitle(),
                    product.getDescription(),
                    product.getPrice(),
                    product.getStock(),
                    product.getImageUrl(),
                    product.getSellerId().toString(),
                    product.getCategories().stream().map(ProductCategory::getCategoryName).collect(Collectors.toSet())
            );
        }

        static UpdateProductRequest updateProductRequest(final Product product) {
            return new UpdateProductRequest(
                    product.getId(),
                    product.getTitle(),
                    product.getDescription(),
                    product.getPrice(),
                    product.getStock(),
                    product.getImageUrl(),
                    product.getSellerId().toString(),
                    Objects.nonNull(product.getCategories()) ?
                    product.getCategories().stream().map(ProductCategory::getCategoryName).collect(Collectors.toSet()) :
                    Set.of()
            );
        }
    }

    public interface OrderUtils {
        static CreateOrderRequest createOrderRequest(final Order order) {
            return new CreateOrderRequest(
                    order.getBuyerId(),
                    order.getItems().stream().map(
                            orderItem -> new CreateOrderRequest.CreateOrderItemRequest(
                                    orderItem.getQuantity(),
                                    orderItem.getProduct().getId()
                            )
                    ).toList()
            );
        }
    }
}
