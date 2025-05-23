package org.deal.productservice.controller;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.OrderDTO;
import org.deal.core.exception.DealError;
import org.deal.core.request.order.CreateOrderRequest;
import org.deal.core.response.DealResponse;
import org.deal.productservice.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import static org.deal.core.util.Constants.ReturnMessages.failedToSave;
import static org.deal.core.util.Constants.ReturnMessages.notFound;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public DealResponse<List<OrderDTO>> getOrders() {
        return orderService.findAllOrders()
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(OrderDTO.class)),
                        HttpStatus.NOT_FOUND));
    }

    @GetMapping("/buyer")
    public DealResponse<List<OrderDTO>> findAllOrdersByBuyerId(@RequestParam final UUID id) {
        return orderService.findAllOrdersByBuyerId(id)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(OrderDTO.class)),
                        HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{id}")
    public DealResponse<OrderDTO> findOrderById(@PathVariable final UUID id) {
        return orderService.findOrderById(id)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(OrderDTO.class, "id", id)),
                        NOT_FOUND));
    }

    @PostMapping
    public DealResponse<OrderDTO> createOrder(@RequestBody final CreateOrderRequest request) {
        return orderService.saveOrder(request)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(failedToSave(OrderDTO.class)),
                        BAD_REQUEST));
    }

    @DeleteMapping("/{id}")
    public DealResponse<OrderDTO> deleteProductById(@PathVariable final UUID id) {
        return orderService.deleteOrderById(id)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(OrderDTO.class, "id", id)),
                        NOT_FOUND));
    }
}
