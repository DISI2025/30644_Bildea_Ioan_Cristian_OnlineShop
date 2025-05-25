package org.deal.productservice.repository;

import org.deal.productservice.entity.ProductNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductNodeRepository extends Neo4jRepository<ProductNode, UUID> {

    @Query("""
            MATCH (u:User {id: $userId})
            OPTIONAL MATCH (u)-[:VIEWED]->(viewed:Product)
            OPTIONAL MATCH (u)-[:PURCHASED]->(bought:Product)
            OPTIONAL MATCH (viewed)-[:HAS_CATEGORY]->(viewedCat:ProductCategory)
            OPTIONAL MATCH (bought)-[:HAS_CATEGORY]->(boughtCat:ProductCategory)
            OPTIONAL MATCH (u)-[:HAS_CATEGORY]->(prefCat:ProductCategory)
            WITH u, collect(DISTINCT viewedCat) + collect(DISTINCT boughtCat) + collect(DISTINCT prefCat) AS allCategories
            UNWIND allCategories AS category
            MATCH (p:Product)-[:HAS_CATEGORY]->(category)
            WHERE NOT (u)-[:VIEWED|PURCHASED]->(p)
            AND NOT (u)-[:SELLS]->(p)
            WITH p, count(*) AS categoryOverlap
            ORDER BY categoryOverlap DESC
            RETURN DISTINCT p
            LIMIT 10
            """)
    List<ProductNode> findRecommendedProducts(@Param("userId") UUID userId);

    @Query("""
            MATCH (u:User {id: $userId})-[:VIEWED]->(viewed:Product)
            MATCH (other:User)-[:VIEWED]->(viewed)
            WHERE other.id <> $userId
            MATCH (other)-[:VIEWED]->(otherViewed:Product)
            WHERE NOT (u)-[:VIEWED|PURCHASED]->(otherViewed)
            AND NOT (u)-[:SELLS]->(otherViewed)
            WITH otherViewed, count(*) AS commonViews
            ORDER BY commonViews DESC
            RETURN DISTINCT otherViewed
            LIMIT 5
            """)
    List<ProductNode> findSimilarUserProducts(@Param("userId") UUID userId);

    @Query("""
            MATCH (u:User {id: $userId})-[:HAS_CATEGORY]->(cat:ProductCategory)
            MATCH (p:Product)-[:HAS_CATEGORY]->(cat)
            WHERE NOT (u)-[:VIEWED|PURCHASED]->(p)
            AND NOT (u)-[:SELLS]->(p)
            WITH p, count(*) AS categoryMatches
            ORDER BY categoryMatches DESC, p.createdAt DESC
            RETURN DISTINCT p
            LIMIT 5
            """)
    List<ProductNode> findProductsByUserCategories(@Param("userId") UUID userId);

    @Query("""
            MATCH (u:User {id: $userId})-[v:VIEWED]->(p:Product)
            WHERE NOT EXISTS((u)-[:PURCHASED]->(p))
            AND NOT EXISTS((u)-[:SELLS]->(p))
            WITH p
            ORDER BY v.lastViewedAt DESC
            RETURN p
            LIMIT 5
            """)
    List<ProductNode> findRecentlyViewedNotPurchased(@Param("userId") UUID userId);
} 