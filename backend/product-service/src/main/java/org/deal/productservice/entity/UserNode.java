package org.deal.productservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.Set;
import java.util.UUID;

@Node("User")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "with")
@ToString
public class UserNode {
    @Id
    private UUID id;

    @Relationship(type = "SELLS", direction = Relationship.Direction.OUTGOING)
    private Set<ProductNode> products;

    @Relationship(type = "HAS_CATEGORY", direction = Relationship.Direction.OUTGOING)
    private Set<ProductCategoryNode> categories;

    @Relationship(type = "VIEWED", direction = Relationship.Direction.OUTGOING)
    private Set<ProductNode> viewedProducts;

    @Relationship(type = "PURCHASED", direction = Relationship.Direction.OUTGOING)
    private Set<ProductNode> purchasedProducts;
} 