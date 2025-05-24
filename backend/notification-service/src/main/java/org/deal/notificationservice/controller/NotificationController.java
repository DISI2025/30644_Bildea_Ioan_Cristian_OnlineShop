package org.deal.notificationservice.controller;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.ProductDTO;
import org.deal.core.response.DealResponse;
import org.deal.notificationservice.service.NotificationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notify")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/{buyerId}")
    public DealResponse<String> sendNotification(@PathVariable String buyerId,
                                                 @RequestParam String message) {
        notificationService.notifyBuyer(buyerId, message);
        return DealResponse.successResponse("Notification sent to: " + buyerId);
    }
}