package org.deal.core.response.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import org.deal.core.util.Role;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Builder(setterPrefix = "with")
@JsonIgnoreProperties(ignoreUnknown = true)
public record UserProfileResponse (
        UUID id,
        String username,
        String email,
        Timestamp createdAt,
        Role role,
        List<UUID> productCategoryIds
) implements Serializable {
}

