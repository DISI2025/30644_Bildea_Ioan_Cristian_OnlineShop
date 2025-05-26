package org.deal.productservice.repository.graph;

import org.deal.productservice.entity.graph.ProductNode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductNodeRepository extends Neo4jRepository<ProductNode, String> {

    Optional<ProductNode> findByProductId(final UUID productId);

    @Query("MATCH (p:Product {productId: $productId}) DETACH DELETE p")
    void deleteByProductId(final UUID productId);

    @Query(value = """
                WITH $userId AS userId
                MATCH (u:User {userId: userId})-[:VIEWED|PURCHASED]->(:Product)-[:HAS_CATEGORY]->(cat:ProductCategory)
                WITH u, collect(DISTINCT cat) AS categories
                UNWIND categories AS cat
                MATCH (rec:Product)-[:HAS_CATEGORY]->(cat)
                WHERE NOT (u)-[:VIEWED|PURCHASED]->(rec)
                WITH u, collect(DISTINCT rec) AS categoryRecs
            
                CALL {
                  WITH u, categoryRecs
                  MATCH (p:Product)<-[:PURCHASED]-(:User)
                  WHERE NOT (u)-[:VIEWED|PURCHASED]->(p) AND NOT p IN categoryRecs
                  WITH p, COUNT(*) AS purchaseCount
                  ORDER BY purchaseCount DESC
                  RETURN collect(p) AS fallbackRecs
                }
            
                WITH categoryRecs + fallbackRecs AS allRecs
                UNWIND allRecs AS finalProduct
                WITH DISTINCT finalProduct
                RETURN finalProduct
                ORDER BY finalProduct.productId ASC
                SKIP $skip
                LIMIT $limit
            """,
            countQuery = """
                        WITH $userId AS userId
                    
                        MATCH (u:User {userId: userId})-[:VIEWED|PURCHASED]->(:Product)-[:HAS_CATEGORY]->(cat:ProductCategory)
                        WITH u, collect(DISTINCT cat) AS categories
                    
                        UNWIND categories AS cat
                        MATCH (rec:Product)-[:HAS_CATEGORY]->(cat)
                        WHERE NOT (u)-[:VIEWED|PURCHASED]->(rec)
                        WITH u, collect(DISTINCT rec) AS categoryRecs
                    
                        CALL {
                          WITH u, categoryRecs
                          MATCH (p:Product)<-[:PURCHASED]-(:User)
                          WHERE NOT (u)-[:VIEWED|PURCHASED]->(p) AND NOT p IN categoryRecs
                          RETURN collect(p) AS fallbackRecs
                        }
                    
                        WITH categoryRecs + fallbackRecs AS allRecs
                        UNWIND allRecs AS finalProduct
                        RETURN count(DISTINCT finalProduct)
                    """)
    Page<ProductNode> findRecommendedProducts(final UUID userId, final Pageable pageable);
}