package org.deal.productservice.service;

import org.deal.productservice.entity.graph.ProductNode;
import org.deal.productservice.entity.graph.UserNode;
import org.deal.productservice.repository.graph.ProductNodeRepository;
import org.deal.productservice.repository.graph.UserNodeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TrackingFacadeTest {

    @Mock
    private ProductNodeRepository productNodeRepository;

    @Mock
    private UserNodeRepository userNodeRepository;

    @InjectMocks
    private TrackingFacade victim;

    @Test
    void testTrackProductView_withExistingUserAndProduct_shouldSaveViewRelation() {
        var userId = UUID.randomUUID();
        var productId = UUID.randomUUID();
        var user = UserNode.builder().withUserId(userId).withViewedProducts(new HashSet<>()).build();
        var product = ProductNode.builder().withProductId(productId).build();

        when(userNodeRepository.findByUserId(userId)).thenReturn(Optional.of(user));
        when(productNodeRepository.findByProductId(productId)).thenReturn(Optional.of(product));
        when(userNodeRepository.save(any())).thenReturn(user);

        victim.trackProductView(userId, productId);

        verify(userNodeRepository).findByUserId(userId);
        verify(productNodeRepository).findByProductId(productId);
        verify(userNodeRepository).save(user);
    }

    @Test
    void testTrackProductPurchased_withNewUserAndProduct_shouldSavePurchaseRelation() {
        var userId = UUID.randomUUID();
        var productId = UUID.randomUUID();
        var user = UserNode.builder().withUserId(userId).build();
        var product = ProductNode.builder().withProductId(productId).build();

        when(userNodeRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(productNodeRepository.findByProductId(productId)).thenReturn(Optional.empty());
        when(userNodeRepository.save(any())).thenReturn(user);

        victim.trackProductPurchased(userId, productId);

        verify(userNodeRepository).findByUserId(userId);
        verify(productNodeRepository).findByProductId(productId);
        verify(userNodeRepository).save(any());
    }
} 