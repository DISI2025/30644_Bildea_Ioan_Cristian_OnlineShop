package org.deal.productservice.repository.graph;

import org.deal.productservice.entity.graph.ProductCategoryNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCategoryNodeRepository extends Neo4jRepository<ProductCategoryNode, String> {
} 