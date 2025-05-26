package org.deal.productservice.service;

import org.deal.productservice.entity.Product;
import org.deal.productservice.entity.ProductCategory;
import org.deal.productservice.entity.graph.ProductCategoryNode;
import org.deal.productservice.entity.graph.ProductNode;
import org.deal.productservice.repository.graph.ProductCategoryNodeRepository;
import org.deal.productservice.repository.graph.ProductNodeRepository;
import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductSyncServiceTest {

    @Mock
    private ProductNodeRepository productNodeRepository;

    @Mock
    private ProductCategoryNodeRepository productCategoryNodeRepository;

    @InjectMocks
    private ProductSyncService victim;

    @Captor
    private ArgumentCaptor<ProductNode> productNodeCaptor;

    @Captor
    private ArgumentCaptor<Set<ProductCategoryNode>> categoryNodesCaptor;

    @Test
    void testSyncCreate_shouldCreateProductNodeAndCategoryNodes() {
        var product = Instancio.create(Product.class);
        var category = Instancio.create(ProductCategory.class);
        product.setCategories(Set.of(category));

        when(productNodeRepository.save(any(ProductNode.class))).thenAnswer(invocation -> invocation.getArgument(0));

        victim.syncCreate(product);

        verify(productNodeRepository, times(2)).save(productNodeCaptor.capture());
        verify(productCategoryNodeRepository).saveAll(categoryNodesCaptor.capture());

        var capturedProductNode = productNodeCaptor.getValue();
        var capturedCategoryNodes = categoryNodesCaptor.getValue();

        assertThat(capturedProductNode.getProductId(), equalTo(product.getId()));
        assertThat(capturedCategoryNodes, hasSize(1));
        assertThat(capturedCategoryNodes.iterator().next().getProductCategoryId(), 
                  equalTo(category.getId()));
    }

    @Test
    void testSyncUpdate_whenProductExists_shouldUpdateCategories() {
        var product = Instancio.create(Product.class);
        var category = Instancio.create(ProductCategory.class);
        product.setCategories(Set.of(category));
        
        var existingNode = ProductNode.builder()
                .withProductId(product.getId())
                .withCategories(Set.of())
                .build();

        when(productNodeRepository.findByProductId(product.getId())).thenReturn(Optional.of(existingNode));
        when(productNodeRepository.save(any(ProductNode.class))).thenAnswer(invocation -> invocation.getArgument(0));

        victim.syncUpdate(product);

        verify(productNodeRepository).save(productNodeCaptor.capture());
        var capturedProductNode = productNodeCaptor.getValue();
        
        assertThat(capturedProductNode.getProductId(), equalTo(product.getId()));
        assertThat(capturedProductNode.getCategories(), hasSize(1));
        assertThat(capturedProductNode.getCategories().iterator().next().getProductCategoryId(),
                  equalTo(category.getId()));
    }

    @Test
    void testSyncUpdate_whenProductDoesNotExist_shouldNotUpdate() {
        var product = Instancio.create(Product.class);
        when(productNodeRepository.findByProductId(product.getId())).thenReturn(Optional.empty());

        victim.syncUpdate(product);

        verify(productNodeRepository, never()).save(any());
    }

    @Test
    void testSyncDelete_shouldDeleteProductNode() {
        var productId = UUID.randomUUID();

        victim.syncDelete(productId);

        verify(productNodeRepository).deleteByProductId(productId);
    }
}