package org.deal.productservice.entity.graph;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

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
    @GeneratedValue(generatorClass = UUIDStringGenerator.class)
    private String id;

    @Property
    private UUID userId;

    @Relationship(type = "VIEWED", direction = Relationship.Direction.OUTGOING)
    private Set<ProductNode> viewedProducts;

    @Relationship(type = "PURCHASED", direction = Relationship.Direction.OUTGOING)
    private Set<ProductNode> purchasedProducts;
} 