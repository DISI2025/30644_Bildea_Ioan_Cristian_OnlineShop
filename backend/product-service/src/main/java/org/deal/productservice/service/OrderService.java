package org.deal.productservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.deal.core.dto.OrderDTO;
import org.deal.core.dto.OrderItemDTO;
import org.deal.core.dto.ProductDTO;
import org.deal.core.exception.DealException;
import org.deal.core.request.order.CreateOrderRequest;
import org.deal.core.util.Mapper;
import org.deal.core.util.OrderStatus;
import org.deal.productservice.entity.Order;
import org.deal.productservice.entity.OrderItem;
import org.deal.productservice.entity.Product;
import org.deal.productservice.repository.OrderItemRepository;
import org.deal.productservice.repository.OrderRepository;
import org.deal.productservice.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;

    public Optional<List<OrderDTO>> findAllOrders() {
        return Optional.of(orderRepository.findAll().stream().map(this::mapToDTO).toList());
    }

    public Optional<List<OrderDTO>> findAllOrdersByBuyerId(final UUID buyerId) {
        return Optional.of(orderRepository.findAllByBuyerId(buyerId).stream().map(this::mapToDTO).toList());
    }

    public Optional<OrderDTO> findOrderById(final UUID orderId) {
        return orderRepository.findById(orderId).map(this::mapToDTO);
    }

    public Optional<OrderDTO> saveOrder(final CreateOrderRequest request) {
        var orderProducts = productRepository.findMultipleById(
                request.items().stream()
                        .map(CreateOrderRequest.CreateOrderItemRequest::productId)
                        .toList());
        var productsById = orderProducts.stream()
                .collect(Collectors.toMap(Product::getId, product -> product));
        checkProductStock(request, productsById);

        var order = orderRepository.save(
                Order.builder()
                        .withBuyerId(request.buyerId())
                        .withStatus(OrderStatus.PENDING)
                        .build());
        var orderItems = saveOrderItems(request.items(), order, productsById);
        order.setItems(orderItems);

        return Optional.of(mapToDTO(orderRepository.save(order)));
    }

    public List<Order> findNotFinishedOrders() {
        return orderRepository.findNotFinishedOrders();
    }

    public void updateOrderStatus(final Order order, final OrderStatus status) {
        order.setStatus(status);
        orderRepository.save(order);

        if (status == OrderStatus.PROCESSING) {
            var orderedQuantityPerProduct = order.getItems().stream()
                    .collect(Collectors.toMap(item -> item.getProduct().getId(), OrderItem::getQuantity));
            var toUpdateProducts = productRepository.findMultipleById(
                    order.getItems().stream()
                            .map(item -> item.getProduct().getId())
                            .toList());
            toUpdateProducts.forEach(product -> {
                var quantity = orderedQuantityPerProduct.get(product.getId());
                product.setStock(product.getStock() - quantity);
            });

            productRepository.saveAll(toUpdateProducts);
        }
    }

    public Optional<OrderDTO> deleteOrderById(final UUID id) {
        return orderRepository.findById(id)
                .filter(__ -> orderRepository.deleteByIdReturning(id) != 0)
                .map(this::mapToDTO);
    }

    private void checkProductStock(final CreateOrderRequest request, final Map<UUID, Product> products) {
        request.items().forEach(createOrderItemRequest -> {
            var product = products.get(createOrderItemRequest.productId());
            if (createOrderItemRequest.quantity() > product.getStock()) {
                throw new DealException("Not enough stock for product " + product.getId(), HttpStatus.BAD_REQUEST);
            }
        });
    }

    private List<OrderItem> saveOrderItems(
            final List<CreateOrderRequest.CreateOrderItemRequest> requests,
            final Order order,
            final Map<UUID, Product> products) {
        var orderItems = requests.stream()
                .map(request -> mapRequestToOrderItem(request, order, products))
                .toList();
        return orderItemRepository.saveAll(orderItems);
    }

    private OrderItem mapRequestToOrderItem(CreateOrderRequest.CreateOrderItemRequest request, final Order order, final Map<UUID, Product> products) {
        return OrderItem.builder()
                .withQuantity(request.quantity())
                .withProduct(Optional.ofNullable(
                                products.get(request.productId()))
                                     .orElseThrow(() -> new DealException("Product with id " + request.productId() + " not found", HttpStatus.BAD_REQUEST)))
                .withOrder(order)
                .build();
    }

    private OrderDTO mapToDTO(final Order order) {
        return new OrderDTO(
                order.getId(),
                order.getBuyerId(),
                order.getDate(),
                order.getStatus(),
                order.getItems().stream().map(this::mapToOrderItemDTO).toList()
        );
    }

    private OrderItemDTO mapToOrderItemDTO(final OrderItem orderItem) {
        return new OrderItemDTO(
                orderItem.getId(),
                orderItem.getOrder().getId(),
                orderItem.getQuantity(),
                Mapper.mapTo(orderItem.getProduct(), ProductDTO.class)
        );
    }
}
