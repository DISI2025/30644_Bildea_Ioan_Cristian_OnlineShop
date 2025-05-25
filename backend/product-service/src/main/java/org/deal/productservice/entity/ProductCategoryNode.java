package org.deal.productservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.Set;
import java.util.UUID;

@Node("ProductCategory")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "with")
@ToString
public class ProductCategoryNode {
    @Id
    private UUID id;

    @Property("categoryName")
    private String categoryName;

    @Relationship(type = "HAS_CATEGORY", direction = Relationship.Direction.INCOMING)
    private Set<ProductNode> products;
} 