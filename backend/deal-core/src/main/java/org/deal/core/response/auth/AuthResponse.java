package org.deal.core.response.auth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import org.deal.core.dto.UserDTO;

@Builder(setterPrefix = "with")
@JsonIgnoreProperties(ignoreUnknown = true)
public record AuthResponse(String accessToken, UserDTO user) {
}