package org.deal.productservice.service;

import org.deal.core.dto.OrderDTO;
import org.deal.core.exception.DealException;
import org.deal.core.request.order.CreateOrderRequest;
import org.deal.core.util.OrderStatus;
import org.deal.productservice.entity.Order;
import org.deal.productservice.entity.OrderItem;
import org.deal.productservice.entity.Product;
import org.deal.productservice.repository.OrderItemRepository;
import org.deal.productservice.repository.OrderRepository;
import org.deal.productservice.repository.ProductRepository;
import org.deal.productservice.util.BaseUnitTest;
import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.instanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest extends BaseUnitTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private OrderItemRepository orderItemRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private TrackingFacade facade;

    @InjectMocks
    private OrderService victim;

    @Test
    void testFindAllOrders_shouldReturnMappedDTOs() {
        var order = Instancio.create(Order.class);
        var orderItem = Instancio.create(OrderItem.class);
        orderItem.setOrder(order);
        order.setItems(List.of(orderItem));
        when(orderRepository.findAll()).thenReturn(List.of(order));

        var result = victim.findAllOrders();

        verify(orderRepository).findAll();
        result.ifPresentOrElse(
                orders -> assertThat(orders, hasItem(instanceOf(OrderDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testFindAllOrdersByBuyerId_shouldReturnMappedDTOs() {
        var buyerId = UUID.randomUUID();
        var order = Instancio.create(Order.class);
        var orderItem = Instancio.create(OrderItem.class);
        orderItem.setOrder(order);
        order.setItems(List.of(orderItem));
        when(orderRepository.findAllByBuyerId(buyerId)).thenReturn(List.of(order));

        var result = victim.findAllOrdersByBuyerId(buyerId);

        verify(orderRepository).findAllByBuyerId(buyerId);
        result.ifPresentOrElse(
                orders -> assertThat(orders, hasItem(instanceOf(OrderDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testFindOrderById_shouldReturnMappedDTO() {
        var order = Instancio.create(Order.class);
        var orderItem = Instancio.create(OrderItem.class);
        orderItem.setOrder(order);
        order.setItems(List.of(orderItem));
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));

        var result = victim.findOrderById(order.getId());

        verify(orderRepository).findById(order.getId());
        result.ifPresentOrElse(
                dto -> assertThat(dto.id(), equalTo(order.getId())),
                this::assertThatFails
        );
    }

    @Test
    void testFindOrderById_notFound_shouldReturnEmpty() {
        when(orderRepository.findById(any())).thenReturn(Optional.empty());

        var result = victim.findOrderById(UUID.randomUUID());

        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testSaveOrder_validRequest_shouldReturnSavedOrder() {
        var product = Instancio.create(Product.class);
        var savedOrder = Instancio.create(Order.class);
        var productId = product.getId();

        var request = new CreateOrderRequest(savedOrder.getBuyerId(), List.of(new CreateOrderRequest.CreateOrderItemRequest(1, productId)));

        when(productRepository.findMultipleById(any())).thenReturn(List.of(product));
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);
        when(orderItemRepository.saveAll(any())).thenReturn(List.of());

        var result = victim.saveOrder(request);

        verify(orderRepository, times(2)).save(any());
        result.ifPresentOrElse(
                dto -> assertThat(dto.buyerId(), equalTo(savedOrder.getBuyerId())),
                this::assertThatFails
        );
    }

    @Test
    void testSaveOrder_insufficientStock_shouldThrowException() {
        var product = Instancio.create(Product.class);
        product.setStock(0); // not enough stock
        var productId = product.getId();

        var request = new CreateOrderRequest(
                UUID.randomUUID(),
                List.of(new CreateOrderRequest.CreateOrderItemRequest(1, productId))
        );

        when(productRepository.findMultipleById(any())).thenReturn(List.of(product));

        assertThrows(DealException.class, () -> victim.saveOrder(request));
    }

    @Test
    void testFindNotFinishedOrders_shouldReturnOrders() {
        var order = Instancio.create(Order.class);
        when(orderRepository.findNotFinishedOrders()).thenReturn(List.of(order));

        var result = victim.findNotFinishedOrders();

        verify(orderRepository).findNotFinishedOrders();
        assertThat(result, hasItem(order));
    }

    @Test
    void testUpdateOrderStatus_setsStatusAndSaves() {
        var order = Instancio.create(Order.class);

        victim.updateOrderStatus(order, OrderStatus.SHIPPING);

        verify(orderRepository).save(order);
        assertThat(order.getStatus(), equalTo(OrderStatus.SHIPPING));
    }

    @Test
    void testUpdateOrderStatus_processingStockValid_shouldDeductAndSaveProducts() {
        var order = Instancio.create(Order.class);
        var product = Instancio.create(Product.class);
        product.setStock(10);

        var item = Instancio.create(OrderItem.class);
        item.setProduct(product);
        item.setQuantity(5);
        order.setItems(List.of(item));

        when(productRepository.findMultipleById(any())).thenReturn(List.of(product));
        when(orderRepository.save(order)).thenReturn(order);

        victim.updateOrderStatus(order, OrderStatus.PROCESSING);

        verify(productRepository).saveAll(any());
        verify(facade).trackProductPurchased(order.getBuyerId(), product.getId());
        assertThat(product.getStock(), equalTo(5));
    }

    @Test
    void testUpdateOrderStatus_processingStockInvalid_shouldCancelOrder() {
        var order = Instancio.create(Order.class);
        var product = Instancio.create(Product.class);
        product.setStock(1);

        var item = Instancio.create(OrderItem.class);
        item.setProduct(product);
        item.setQuantity(5);
        order.setItems(List.of(item));

        when(productRepository.findMultipleById(any())).thenReturn(List.of(product));
        when(orderRepository.save(order)).thenReturn(order);

        victim.updateOrderStatus(order, OrderStatus.PROCESSING);

        verify(orderRepository, atLeastOnce()).save(order);
        verify(facade, never()).trackProductPurchased(order.getBuyerId(), product.getId());
        assertThat(order.getStatus(), equalTo(OrderStatus.CANCELLED));
    }

    @Test
    void testDeleteOrderById_orderExists_shouldDelete() {
        var order = Instancio.create(Order.class);
        var orderItem = Instancio.create(OrderItem.class);
        orderItem.setOrder(order);
        order.setItems(List.of(orderItem));
        var id = order.getId();

        when(orderRepository.findById(id)).thenReturn(Optional.of(order));
        when(orderRepository.deleteByIdReturning(id)).thenReturn(1);

        var result = victim.deleteOrderById(id);

        verify(orderRepository).deleteByIdReturning(id);
        result.ifPresentOrElse(
                dto -> assertThat(dto.id(), equalTo(id)),
                this::assertThatFails
        );
    }

    @Test
    void testDeleteOrderById_orderDoesNotExist_shouldReturnEmpty() {
        when(orderRepository.findById(any())).thenReturn(Optional.empty());

        var result = victim.deleteOrderById(UUID.randomUUID());

        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testDeleteOrderById_deleteFails_shouldReturnEmpty() {
        var order = Instancio.create(Order.class);
        when(orderRepository.findById(order.getId())).thenReturn(Optional.of(order));
        when(orderRepository.deleteByIdReturning(order.getId())).thenReturn(0);

        var result = victim.deleteOrderById(order.getId());

        result.ifPresent(this::assertThatFails);
    }
}
