package org.deal.productservice.config;

import lombok.extern.slf4j.Slf4j;
import org.deal.core.util.OrderStatus;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Slf4j
public class OrderStateMachine {

    public static Optional<OrderStatus> next(final OrderStatus current) {
        return switch (current) {
            case PENDING -> Optional.of(OrderStatus.PROCESSING);
            case PROCESSING -> Optional.of(OrderStatus.SHIPPING);
            case SHIPPING -> Optional.of(OrderStatus.DONE);
            case DONE, CANCELLED -> Optional.empty();
        };
    }
}
