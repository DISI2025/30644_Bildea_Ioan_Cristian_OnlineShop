package org.deal.productservice.controller;


import org.deal.core.dto.OrderDTO;
import org.deal.core.exception.DealError;
import org.deal.core.util.Mapper;
import org.deal.productservice.entity.Order;
import org.deal.productservice.service.OrderService;
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
import static org.deal.productservice.util.TestUtils.OrderUtils.createOrderRequest;
import static org.deal.productservice.util.TestUtils.ResponseUtils.assertThatResponseFailed;
import static org.deal.productservice.util.TestUtils.ResponseUtils.assertThatResponseIsSuccessful;
import static org.deal.productservice.util.TestUtils.convertAll;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController victim;

    @Test
    void testGetOrders_shouldReturnSuccess() {
        var orders = List.of(Instancio.create(Order.class), Instancio.create(Order.class));
        when(orderService.findAllOrders()).thenReturn(Optional.of(convertAll(orders, OrderDTO.class)));

        var response = victim.getOrders();

        verify(orderService).findAllOrders();
        assertThatResponseIsSuccessful(response, convertAll(orders, OrderDTO.class));
    }

    @Test
    void testGetOrders_shouldReturnFailureIfEmpty() {
        when(orderService.findAllOrders()).thenReturn(Optional.empty());

        var response = victim.getOrders();

        verify(orderService).findAllOrders();
        assertThatResponseFailed(response, List.of(new DealError(notFound(OrderDTO.class))), HttpStatus.NOT_FOUND);
    }

    @Test
    void testFindOrderById_orderFound_returnsSuccess() {
        var order = Instancio.create(Order.class);
        var dto = Mapper.mapTo(order, OrderDTO.class);
        when(orderService.findOrderById(order.getId())).thenReturn(Optional.of(dto));

        var response = victim.findOrderById(order.getId());

        verify(orderService).findOrderById(order.getId());
        assertThatResponseIsSuccessful(response, dto);
    }

    @Test
    void testFindOrderById_orderNotFound_returnsFailure() {
        var id = UUID.randomUUID();
        when(orderService.findOrderById(id)).thenReturn(Optional.empty());

        var response = victim.findOrderById(id);

        verify(orderService).findOrderById(id);
        assertThatResponseFailed(response, List.of(new DealError(notFound(OrderDTO.class, "id", id))), HttpStatus.NOT_FOUND);
    }

    @Test
    void testCreateOrder_orderCreated_returnsSuccess() {
        var order = Instancio.create(Order.class);
        var dto = Mapper.mapTo(order, OrderDTO.class);
        var request = createOrderRequest(order);
        when(orderService.saveOrder(request)).thenReturn(Optional.of(dto));

        var response = victim.createOrder(request);

        verify(orderService).saveOrder(request);
        assertThatResponseIsSuccessful(response, dto);
    }

    @Test
    void testCreateOrder_creationFailed_returnsFailure() {
        var request = createOrderRequest(Instancio.create(Order.class));
        when(orderService.saveOrder(request)).thenReturn(Optional.empty());

        var response = victim.createOrder(request);

        verify(orderService).saveOrder(request);
        assertThatResponseFailed(response, List.of(new DealError(failedToSave(OrderDTO.class))), HttpStatus.BAD_REQUEST);
    }

    @Test
    void testDeleteOrderById_orderDeleted_returnsSuccess() {
        var order = Instancio.create(Order.class);
        var dto = Mapper.mapTo(order, OrderDTO.class);
        when(orderService.deleteOrderById(order.getId())).thenReturn(Optional.of(dto));

        var response = victim.deleteProductById(order.getId());

        verify(orderService).deleteOrderById(order.getId());
        assertThatResponseIsSuccessful(response, dto);
    }

    @Test
    void testDeleteOrderById_orderNotFound_returnsFailure() {
        var id = UUID.randomUUID();
        when(orderService.deleteOrderById(id)).thenReturn(Optional.empty());

        var response = victim.deleteProductById(id);

        verify(orderService).deleteOrderById(id);
        assertThatResponseFailed(response, List.of(new DealError(notFound(OrderDTO.class, "id", id))), HttpStatus.NOT_FOUND);
    }

    @Test
    void testFindAllOrdersByBuyerId_found_returnsSuccess() {
        var buyerId = UUID.randomUUID();
        var orders = List.of(Instancio.create(Order.class), Instancio.create(Order.class));
        when(orderService.findAllOrdersByBuyerId(buyerId)).thenReturn(Optional.of(convertAll(orders, OrderDTO.class)));

        var response = victim.findAllOrdersByBuyerId(buyerId);

        verify(orderService).findAllOrdersByBuyerId(buyerId);
        assertThatResponseIsSuccessful(response, convertAll(orders, OrderDTO.class));
    }

    @Test
    void testFindAllOrdersByBuyerId_notFound_returnsFailure() {
        var buyerId = UUID.randomUUID();
        when(orderService.findAllOrdersByBuyerId(buyerId)).thenReturn(Optional.empty());

        var response = victim.findAllOrdersByBuyerId(buyerId);

        verify(orderService).findAllOrdersByBuyerId(buyerId);
        assertThatResponseFailed(response, List.of(new DealError(notFound(OrderDTO.class))), HttpStatus.NOT_FOUND);
    }
}
