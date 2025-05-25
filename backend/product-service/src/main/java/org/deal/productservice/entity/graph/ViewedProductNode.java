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

import java.time.Instant;
import java.util.UUID;

@Node("ViewedProduct")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "with")
@ToString
public class ViewedProductNode {

    @Id
    @GeneratedValue(generatorClass = UUIDStringGenerator.class)
    private UUID id;

    @Property("viewedAt")
    private Instant viewedAt;

    @Relationship(type = "VIEWED", direction = Relationship.Direction.INCOMING)
    private UserNode user;

    @Relationship(type = "VIEWED", direction = Relationship.Direction.OUTGOING)
    private ProductNode product;
} 