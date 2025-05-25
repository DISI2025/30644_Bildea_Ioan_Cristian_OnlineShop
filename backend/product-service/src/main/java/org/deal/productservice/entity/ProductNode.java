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

import java.sql.Timestamp;
import java.util.Set;
import java.util.UUID;

@Node("Product")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "with")
@ToString
public class ProductNode {
    @Id
    private UUID id;

    @Property("title")
    private String title;

    @Property("description")
    private String description;

    @Property("price")
    private Double price;

    @Property("stock")
    private Integer stock;

    @Property("imageUrl")
    private String imageUrl;

    @Property("sellerId")
    private UUID sellerId;

    @Property("createdAt")
    private Timestamp createdAt;

    @Relationship(type = "HAS_CATEGORY", direction = Relationship.Direction.OUTGOING)
    private Set<ProductCategoryNode> categories;

    @Relationship(type = "SELLS", direction = Relationship.Direction.INCOMING)
    private UserNode seller;
} 