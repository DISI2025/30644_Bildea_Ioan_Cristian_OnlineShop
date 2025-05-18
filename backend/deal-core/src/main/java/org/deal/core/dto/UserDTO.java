package org.deal.core.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.deal.core.util.Role;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UserDTO(
        UUID id,
        String username,
        String email,
        Timestamp createdAt,
        Role role
) implements Serializable {
}
