package org.deal.core.response.notification;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;

import java.io.Serializable;

@Builder(setterPrefix = "with")
@JsonIgnoreProperties(ignoreUnknown = true)
public record NotificationMessage (
        String buyerId,
        String message

) implements Serializable {
}
