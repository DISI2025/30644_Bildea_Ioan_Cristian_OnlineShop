package org.deal.productservice.repository.graph;

import org.deal.productservice.entity.graph.ViewedProductNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ViewedProductNodeRepository extends Neo4jRepository<ViewedProductNode, UUID> {
} 