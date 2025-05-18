package org.deal.core.request.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import org.deal.core.util.Role;

import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record UpdateUserRequest(
        @JsonProperty UUID id,
        @JsonProperty String username,
        @JsonProperty String email,
        @JsonProperty Role role) {
}
