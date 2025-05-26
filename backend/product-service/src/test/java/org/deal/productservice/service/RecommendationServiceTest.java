package org.deal.productservice.service;

import org.deal.core.dto.ProductDTO;
import org.deal.core.request.product.ProductsFilter;
import org.deal.core.util.Mapper;
import org.deal.core.util.SortDir;
import org.deal.productservice.entity.Product;
import org.deal.productservice.entity.graph.ProductNode;
import org.deal.productservice.repository.ProductRepository;
import org.deal.productservice.repository.graph.ProductNodeRepository;
import org.deal.productservice.util.BaseUnitTest;
import org.deal.productservice.util.PaginationUtils;
import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest extends BaseUnitTest {

    @Mock
    private ProductNodeRepository productNodeRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private RecommendationService victim;

    @Test
    void testGetRecommendedProducts_withSufficientRecommendations_shouldReturnRecommendedProducts() {
        var userId = UUID.randomUUID();
        var filter = new ProductsFilter("title", "", SortDir.ASC, 0, 10);
        var pageable = PaginationUtils.buildPageableRequest(filter);
        var productNode = Instancio.create(ProductNode.class);
        var product = Instancio.create(Product.class);
        product.setId(productNode.getProductId());
        Page<ProductNode> page = mock(Page.class);
        when(page.isEmpty()).thenReturn(false);
        when(page.getTotalElements()).thenReturn(5L);
        when(page.getContent()).thenReturn(List.of(productNode));
        when(productNodeRepository.findRecommendedProducts(userId, pageable)).thenReturn(page);
        when(productRepository.findMultipleById(List.of(productNode.getProductId()))).thenReturn(List.of(product));

        var result = victim.getRecommendedProducts(userId, filter);

        verify(productNodeRepository).findRecommendedProducts(userId, pageable);
        verify(productRepository).findMultipleById(List.of(productNode.getProductId()));
        verify(productRepository, never()).findPopularProducts(4);
        assertThat(result.getContent(), hasItem(Mapper.mapTo(product, ProductDTO.class)));
    }

    @Test
    void testGetRecommendedProducts_withInSufficientRecommendations_shouldReturnPopularProducts() {
        var userId = UUID.randomUUID();
        var filter = new ProductsFilter("title", "", SortDir.ASC, 0, 10);
        var pageable = PaginationUtils.buildPageableRequest(filter);
        var productNode = Instancio.create(ProductNode.class);
        var product = Instancio.create(Product.class);
        product.setId(productNode.getProductId());
        Page<ProductNode> page = mock(Page.class);
        when(page.isEmpty()).thenReturn(true);
        when(productNodeRepository.findRecommendedProducts(userId, pageable)).thenReturn(page);
        when(productRepository.findPopularProducts(4)).thenReturn(List.of(product));

        var result = victim.getRecommendedProducts(userId, filter);

        verify(productNodeRepository).findRecommendedProducts(userId, pageable);
        verify(productRepository, never()).findMultipleById(List.of(productNode.getProductId()));
        verify(productRepository).findPopularProducts(4);
        assertThat(result.getContent(), hasItem(Mapper.mapTo(product, ProductDTO.class)));
    }
} 