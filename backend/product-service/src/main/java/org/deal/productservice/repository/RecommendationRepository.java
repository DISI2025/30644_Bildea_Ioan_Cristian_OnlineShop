package org.deal.productservice.repository;

import org.deal.productservice.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecommendationRepository extends JpaRepository<Product, UUID> {

    /**
     * Simple recommendation query: Find products from categories that the user has previously purchased,
     * excluding products they already bought, ordered by popularity (number of times purchased by others)
     */
    @Query(value = """
        SELECT DISTINCT p.*, COUNT(oi2.id) as popularity_score
        FROM product p
        JOIN product_categories pc ON p.id = pc.product_id
        JOIN product_categories pc2 ON pc.categories_id = pc2.categories_id
        JOIN product p2 ON pc2.product_id = p2.id
        JOIN order_item oi ON p2.id = oi.product_id
        JOIN "order" o ON oi.order_id = o.id
        LEFT JOIN order_item oi2 ON p.id = oi2.product_id
        WHERE o.buyer_id = :userId
        AND o.status = 'DONE'
        AND p.id NOT IN (
            SELECT DISTINCT oi3.product_id 
            FROM order_item oi3 
            JOIN "order" o3 ON oi3.order_id = o3.id 
            WHERE o3.buyer_id = :userId AND o3.status = 'DONE'
        )
        AND p.stock > 0
        GROUP BY p.id, p.title, p.description, p.price, p.stock, p.image_url, p.seller_id, p.created_at
        ORDER BY popularity_score DESC, p.created_at DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Product> findRecommendedProductsForUser(@Param("userId") UUID userId, @Param("limit") int limit);

    /**
     * Fallback recommendation: Popular products from all categories (for new users with no purchase history)
     */
    @Query(value = """
        SELECT p.*, COUNT(oi.id) as popularity_score
        FROM product p
        LEFT JOIN order_item oi ON p.id = oi.product_id
        LEFT JOIN "order" o ON oi.order_id = o.id AND o.status = 'DONE'
        WHERE p.stock > 0
        GROUP BY p.id, p.title, p.description, p.price, p.stock, p.image_url, p.seller_id, p.created_at
        ORDER BY popularity_score DESC, p.created_at DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Product> findPopularProducts(@Param("limit") int limit);

    /**
     * Get user's preferred categories based on their purchase history
     */
    @Query(value = """
        SELECT pc.category_name, COUNT(oi.id) as purchase_count
        FROM product_category pc
        JOIN product_categories pcs ON pc.id = pcs.categories_id
        JOIN product p ON pcs.product_id = p.id
        JOIN order_item oi ON p.id = oi.product_id
        JOIN "order" o ON oi.order_id = o.id
        WHERE o.buyer_id = :userId AND o.status = 'DONE'
        GROUP BY pc.id, pc.category_name
        ORDER BY purchase_count DESC
        """, nativeQuery = true)
    List<Object[]> findUserPreferredCategories(@Param("userId") UUID userId);
} 