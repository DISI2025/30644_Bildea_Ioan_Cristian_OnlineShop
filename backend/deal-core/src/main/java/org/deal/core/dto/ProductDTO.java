package org.deal.core.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Set;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
@Builder(setterPrefix = "with")
public record ProductDTO(
        UUID id,
        String title,
        String description,
        Double price,
        Integer stock,
        String imageUrl,
        Set<ProductCategoryDTO> categories,
        UUID sellerId,
        Timestamp createdAt
) implements Serializable {
}
