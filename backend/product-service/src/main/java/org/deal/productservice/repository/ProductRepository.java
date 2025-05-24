package org.deal.productservice.repository;

import jakarta.transaction.Transactional;
import org.deal.productservice.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Transactional
    @Modifying
    @Query(value = "delete from Product p where p.id=:id")
    Integer deleteByIdReturning(final UUID id);

    List<Product> findAllBySellerId(final UUID sellerId);

    @Query(value = "SELECT p from Product p WHERE p.id in :ids")
    List<Product> findMultipleById(final List<UUID> ids);

    @Query("""
            
                    SELECT DISTINCT p FROM Product p
            LEFT JOIN p.categories c
            WHERE (:name IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :name, '%')))
              AND (:categoryId IS NULL OR c.id = :categoryId)
            """)
    List<Product> findWithFilter(
            @Param("name") String name,
            @Param("categoryId") UUID categoryId
    );
}
