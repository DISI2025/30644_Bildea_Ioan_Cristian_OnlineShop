package org.deal.productservice.repository;

import jakarta.transaction.Transactional;
import org.deal.productservice.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, UUID> {

    @Transactional
    @Modifying
    @Query(value = "delete from ProductCategory u where u.id=:id")
    Integer deleteByIdReturning(final UUID id);

    List<ProductCategory> findAllByIdIn(List<UUID> ids);


}
