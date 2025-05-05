package org.deal.core.request.login;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record LoginRequest(
        @JsonProperty String username, @JsonProperty String password) {
}
