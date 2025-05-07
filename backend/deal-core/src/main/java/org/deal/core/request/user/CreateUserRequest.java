package org.deal.core.request.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.deal.core.util.Role;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record CreateUserRequest(
        @JsonProperty String username,
        @JsonProperty String password,
        @JsonProperty Role role) {
}
