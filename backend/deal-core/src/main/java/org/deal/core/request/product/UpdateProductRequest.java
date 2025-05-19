package org.deal.core.request.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProductRequest {
    @JsonProperty
    private UUID id;
    @JsonProperty
    private String title;
    @JsonProperty
    private String description;
    @JsonProperty
    private Double price;
    @JsonProperty
    private Integer stock;
    @JsonProperty
    private String imageUrl;
    @JsonProperty
    private String sellerId;
    @JsonProperty
    private Set<String> categories;
}
