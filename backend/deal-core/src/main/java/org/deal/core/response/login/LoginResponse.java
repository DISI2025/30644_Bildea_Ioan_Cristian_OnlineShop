package org.deal.core.response.login;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.deal.core.dto.UserDTO;

@JsonIgnoreProperties(ignoreUnknown = true)
public record LoginResponse(String accessToken, UserDTO user) {

}