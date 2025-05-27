package org.deal.productservice.repository;

import jakarta.transaction.Transactional;
import org.deal.productservice.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    @Transactional
    @Modifying
    @Query(value = "delete from Product p where p.id=:id")
    Integer deleteByIdReturning(final UUID id);

    List<Product> findAllBySellerId(final UUID sellerId);

    @Query(value = "SELECT p from Product p WHERE p.id in :ids")
    List<Product> findMultipleById(final List<UUID> ids);

    @Query(value = "SELECT p from Product p WHERE p.id in :ids")
    Page<Product> findMultipleById(final List<UUID> ids, final Pageable pageable);

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
    List<Product> findPopularProducts(int limit);
}
