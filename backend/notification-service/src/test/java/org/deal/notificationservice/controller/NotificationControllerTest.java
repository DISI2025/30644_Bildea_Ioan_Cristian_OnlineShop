package org.deal.notificationservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.deal.core.dto.OrderDTO;
import org.deal.core.response.DealResponse;
import org.deal.notificationservice.service.NotificationService;
import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.UUID;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.deal.notificationservice.util.TestUtils.ResponseUtils.assertThatResponseIsSuccessful;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private NotificationController victim;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void testSendNotification_shouldNotifyBuyerAndReturnSuccess() {
        // given
        var orderDTO = Instancio.create(OrderDTO.class);

        // when
        DealResponse<String> response = victim.sendNotification(orderDTO);

        // then
        verify(notificationService).notifyBuyer(orderDTO);
        assertThatResponseIsSuccessful(response, "Notification sent to: " + orderDTO.buyerId());
    }

    @Test
    void sendNotification_shouldReturnError_whenNotificationFails() {
        // given
        var orderDTO = Instancio.create(OrderDTO.class);
        var errorMessage = "Failed to send notification";

        doThrow(new RuntimeException(errorMessage))
                .when(notificationService).notifyBuyer(orderDTO);

        // when + then
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> victim.sendNotification(orderDTO));

        assertThat(exception.getMessage()).isEqualTo(errorMessage);
    }

    @Test
    void sendNotification_shouldCallNotifyBuyerAndReturnSuccessResponse() throws Exception {
        // Arrange
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(victim).build();

        UUID buyerId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();
        OrderDTO orderDTO = new OrderDTO(orderId, buyerId, null, null, null);

        doNothing().when(notificationService).notifyBuyer(orderDTO);

        // Act & Assert
        mockMvc.perform(post("/notify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderDTO)))
                .andExpect(status().isOk());

        verify(notificationService).notifyBuyer(orderDTO);
    }

}