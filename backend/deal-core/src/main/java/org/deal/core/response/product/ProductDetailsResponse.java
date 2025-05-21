package org.deal.core.response.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import org.deal.core.dto.ProductCategoryDTO;
import org.deal.core.dto.UserDTO;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Set;
import java.util.UUID;

@Builder(setterPrefix = "with")
@JsonIgnoreProperties(ignoreUnknown = true)
public record ProductDetailsResponse (
        UUID id,
        String title,
        String description,
        Double price,
        Integer stock,
        String imageUrl,
        Set<ProductCategoryDTO> categories,
        UserDTO sellerDTO,
        Timestamp createdAt
) implements Serializable {
}