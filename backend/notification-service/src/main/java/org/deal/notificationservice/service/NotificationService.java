package org.deal.notificationservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.response.notification.NotificationMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyBuyer(String buyerId, String message) {
        NotificationMessage notification = new NotificationMessage(buyerId, message);
        messagingTemplate.convertAndSend("/topic/notify/" + buyerId, notification);
    }
}