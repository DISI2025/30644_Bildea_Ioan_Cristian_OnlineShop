package org.deal.notificationservice.controller;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.OrderDTO;
import org.deal.core.response.DealResponse;
import org.deal.notificationservice.service.NotificationService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/notify")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

        @PostMapping
        public DealResponse<String> sendNotification(final @RequestBody OrderDTO orderDTO) {
            notificationService.notifyBuyer(orderDTO);
            return DealResponse.successResponse("Notification sent to: " + orderDTO.buyerId());
        }
}