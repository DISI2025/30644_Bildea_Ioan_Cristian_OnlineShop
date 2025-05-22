package org.deal.productservice.repository;

import jakarta.transaction.Transactional;
import org.deal.productservice.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    @Transactional
    @Modifying
    @Query(value = "delete from Product p where p.id=:id")
    Integer deleteByIdReturning(final UUID id);

    List<Product> findAllBySellerId(final UUID sellerId);
}
