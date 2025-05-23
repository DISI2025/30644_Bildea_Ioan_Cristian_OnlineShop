package org.deal.productservice.repository;

import jakarta.transaction.Transactional;
import org.deal.productservice.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    @Transactional
    @Modifying
    @Query(value = "delete from Order o where o.id=:id")
    Integer deleteByIdReturning(final UUID id);

    List<Order> findAllByBuyerId(final UUID buyerId);

    @Query("SELECT o FROM Order o WHERE o.status NOT IN ('DONE', 'CANCELLED')")
    List<Order> findNotFinishedOrders();
}
