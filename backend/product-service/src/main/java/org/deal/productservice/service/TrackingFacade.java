package org.deal.productservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.exception.DealException;
import org.deal.productservice.entity.graph.ProductNode;
import org.deal.productservice.entity.graph.UserNode;
import org.deal.productservice.repository.graph.ProductNodeRepository;
import org.deal.productservice.repository.graph.UserNodeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TrackingFacade {

    private final ProductNodeRepository productNodeRepository;
    private final UserNodeRepository userNodeRepository;

    @Transactional
    public void trackProductView(final UUID userId, final UUID productId) {
        final UserNode user = userNodeRepository.findByUserId(userId)
                .orElseGet(() -> UserNode.builder().withUserId(userId).build());
        final ProductNode product = productNodeRepository.findByProductId(productId)
                .orElseThrow(() -> new DealException("Product node not found", HttpStatus.INTERNAL_SERVER_ERROR));

        if (user.getViewedProducts() == null) {
            user.setViewedProducts(new HashSet<>());
        }

        user.getViewedProducts().add(product);
        userNodeRepository.save(user);
    }

    @Transactional
    public void trackProductPurchased(final UUID userId, final UUID productId) {
        final UserNode user = userNodeRepository.findByUserId(userId)
                .orElseGet(() -> UserNode.builder().withUserId(userId).build());
        final ProductNode product = productNodeRepository.findByProductId(productId)
                .orElseGet(() -> ProductNode.builder().withProductId(productId).build());

        if (user.getPurchasedProducts() == null) {
            user.setPurchasedProducts(new HashSet<>());
        }

        user.getPurchasedProducts().add(product);
        userNodeRepository.save(user);
    }

}
