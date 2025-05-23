package org.deal.notificationservice.controller;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.ProductDTO;
import org.deal.core.response.DealResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notify")
@RequiredArgsConstructor
public class NotificationController {

    @GetMapping
    public DealResponse<String> getProducts() {
        return DealResponse.successResponse("MERGE BA BOULE");
    }
}