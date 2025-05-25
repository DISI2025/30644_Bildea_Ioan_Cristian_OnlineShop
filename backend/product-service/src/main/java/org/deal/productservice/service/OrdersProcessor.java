package org.deal.productservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Headers;
import org.deal.core.client.DealClient;
import org.deal.core.client.DealService;
import org.deal.productservice.config.OrderStateMachine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
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
    private final DealClient dealClient;
    @Value("${notification-token}")
    private String token;

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

                    Headers headers = new Headers.Builder()
                            .add("Authorization", "Basic " + token)
                            .add("Content-Type", "application/json")
                            .build();

                    dealClient.call(
                            DealService.NS,
                            "/notify",
                            HttpMethod.POST,
                            order,
                            headers,
                            String.class
                    );
                }));
    }
}
