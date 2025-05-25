package org.deal.core.response.notification;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import org.deal.core.dto.OrderDTO;

import java.io.Serializable;
import java.util.UUID;

@Builder(setterPrefix = "with")
@JsonIgnoreProperties(ignoreUnknown = true)
public record NotificationResponse(
        OrderDTO orderDTO

) implements Serializable {
}
