package org.deal.notificationservice.service;

import org.deal.core.dto.OrderDTO;
import org.deal.core.dto.OrderItemDTO;
import org.deal.core.response.notification.NotificationResponse;
import org.deal.core.util.OrderStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.refEq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private NotificationService notificationService;

    @Test
    void notifyBuyer_shouldSendNotificationToCorrectTopic() {
        // given
        UUID buyerId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();
        Timestamp date = new Timestamp(System.currentTimeMillis());
        OrderStatus status = OrderStatus.PROCESSING;
        List<OrderItemDTO> items = List.of();

        OrderDTO orderDTO = new OrderDTO(orderId, buyerId, date, status, items);
        String expectedTopic = "/topic/notify/" + buyerId;
        NotificationResponse expectedNotification = new NotificationResponse(orderDTO);

        // when
        notificationService.notifyBuyer(orderDTO);

        // then
        verify(messagingTemplate, times(1))
                .convertAndSend(eq(expectedTopic), refEq(expectedNotification));
    }

    @Test
    void notifyBuyer_shouldThrowException_whenOrderDTOIsNull() {
        assertThrows(IllegalArgumentException.class, () -> notificationService.notifyBuyer(null));
    }

}