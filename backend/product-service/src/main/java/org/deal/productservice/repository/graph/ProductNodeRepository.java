package org.deal.productservice.repository.graph;

import org.deal.productservice.entity.graph.ProductNode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductNodeRepository extends Neo4jRepository<ProductNode, UUID> {

    Optional<ProductNode> findByProductId(final UUID productId);

    @Query("MATCH (p:Product {productId: $productId}) DETACH DELETE p")
    void deleteByProductId(final UUID productId);

    @Query(value = """
            MATCH (u:User {userId: $userId})
            MATCH (u)-[r:VIEWED|PURCHASED]->(p:Product)
            RETURN DISTINCT p
            ORDER BY p.productId ASC
            SKIP $skip
            LIMIT $limit
            """,
            countQuery = """
            MATCH (u:User {userId: $userId})
            MATCH (u)-[r:VIEWED|PURCHASED]->(p:Product)
            RETURN count(DISTINCT p) as total
            """)
    Page<ProductNode> findRecommendedProducts(UUID userId, Pageable pageable);
}