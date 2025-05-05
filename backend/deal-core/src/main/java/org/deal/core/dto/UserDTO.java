package org.deal.core.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.deal.core.util.Role;

import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UserDTO(UUID id, String username, Role role) {
}
