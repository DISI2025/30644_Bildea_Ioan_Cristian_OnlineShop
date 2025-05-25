package org.deal.notificationservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.OrderDTO;
import org.deal.core.response.notification.NotificationResponse;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyBuyer(final OrderDTO orderDTO) {
        if (orderDTO == null) {
            throw new IllegalArgumentException("OrderDTO must not be null");
        }

        NotificationResponse notification = new NotificationResponse(orderDTO);
        messagingTemplate.convertAndSend("/topic/notify/" + orderDTO.buyerId(), notification);
    }
}