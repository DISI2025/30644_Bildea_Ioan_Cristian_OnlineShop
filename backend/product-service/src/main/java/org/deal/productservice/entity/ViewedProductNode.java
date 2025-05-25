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
    private UUID id;

    @Property("viewedAt")
    private Timestamp viewedAt;

    @Relationship(type = "VIEWED", direction = Relationship.Direction.INCOMING)
    private UserNode user;

    @Relationship(type = "VIEWED", direction = Relationship.Direction.OUTGOING)
    private ProductNode product;
} 