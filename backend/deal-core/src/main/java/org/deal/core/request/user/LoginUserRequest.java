package org.deal.core.request.user;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record LoginUserRequest(
        @JsonProperty String username, @JsonProperty String password) {
}
