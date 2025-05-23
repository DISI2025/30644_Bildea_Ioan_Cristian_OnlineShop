package org.deal.productservice.service;


import org.deal.core.util.OrderStatus;
import org.deal.productservice.entity.Order;
import org.deal.productservice.util.BaseUnitTest;
import org.instancio.Instancio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

class OrdersProcessorTest extends BaseUnitTest {

    @Mock
    private OrderService orderService;
    @InjectMocks
    private OrdersProcessor victim;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testProcessOrders_cronDisabled_shouldSkipProcessing() {
        ReflectionTestUtils.setField(victim, "cronjobEnabled", false);

        victim.processOrders();

        verifyNoInteractions(orderService);
    }

    @Test
    void testProcessOrders_noOrders_shouldLogAndReturn() {
        ReflectionTestUtils.setField(victim, "cronjobEnabled", true);
        when(orderService.findNotFinishedOrders()).thenReturn(List.of());

        victim.processOrders();

        verify(orderService).findNotFinishedOrders();
        verifyNoMoreInteractions(orderService);
    }

    @Test
    void testProcessOrders_ordersExist_shouldProcessEach() {
        ReflectionTestUtils.setField(victim, "cronjobEnabled", true);

        Order order1 = Instancio.create(Order.class);
        order1.setStatus(OrderStatus.PENDING);

        Order order2 = Instancio.create(Order.class);
        order2.setStatus(OrderStatus.PROCESSING);

        when(orderService.findNotFinishedOrders()).thenReturn(List.of(order1, order2));

        victim.processOrders();

        verify(orderService).findNotFinishedOrders();
        verify(orderService).updateOrderStatus(eq(order1), any(OrderStatus.class));
        verify(orderService).updateOrderStatus(eq(order2), any(OrderStatus.class));
    }

    @Test
    void testProcessOrders_orderStatusNoTransition_shouldSkipUpdate() {
        ReflectionTestUtils.setField(victim, "cronjobEnabled", true);

        Order finishedOrder = Instancio.create(Order.class);
        finishedOrder.setStatus(OrderStatus.CANCELLED); // assuming no next state from CANCELLED

        when(orderService.findNotFinishedOrders()).thenReturn(List.of(finishedOrder));

        victim.processOrders();

        verify(orderService).findNotFinishedOrders();
        verify(orderService, never()).updateOrderStatus(any(), any());
    }
}
