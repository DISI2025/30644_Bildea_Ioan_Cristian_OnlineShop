package org.deal.notificationservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.OrderDTO;
import org.deal.core.response.notification.NotificationResponse;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyBuyer(OrderDTO orderDTO) {
        NotificationResponse notification = new NotificationResponse(orderDTO);
        messagingTemplate.convertAndSend("/topic/notify/" + orderDTO.buyerId(), notification);
    }
}