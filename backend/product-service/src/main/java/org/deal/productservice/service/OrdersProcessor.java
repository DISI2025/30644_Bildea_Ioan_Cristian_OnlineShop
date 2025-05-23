package org.deal.productservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.deal.productservice.config.OrderStateMachine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrdersProcessor {

    @Value("${orders-cron-active}")
    private boolean cronjobEnabled;
    private final OrderService orderService;

    @Scheduled(fixedRate = 30, initialDelay = 15, timeUnit = TimeUnit.SECONDS)
    public void processOrders() {
        if (!cronjobEnabled) {
            return;
        }

        var orders = orderService.findNotFinishedOrders();
        if (orders.isEmpty()) {
            log.info("No orders to process, returning");
            return;
        }

        orders.forEach(order -> OrderStateMachine.next(order.getStatus())
                .ifPresent(newStatus -> {
                    log.info("Moving order {} from {} to {}", order.getId(), order.getStatus(), newStatus);
                    orderService.updateOrderStatus(order, newStatus);

                    // TODO: Call notifications service with the updated Order, send through websocket on UI
                    // and also maybe an email using our mail service
                }));
    }
}
