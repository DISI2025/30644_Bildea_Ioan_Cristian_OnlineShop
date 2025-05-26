package org.deal.productservice.service;

import org.deal.core.dto.ProductDTO;
import org.deal.core.dto.RecommendationDto;
import org.deal.productservice.entity.Product;
import org.deal.productservice.entity.ProductCategory;
import org.deal.productservice.repository.RecommendationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private RecommendationRepository recommendationRepository;

    @Mock
    private ProductService productService;

    @InjectMocks
    private RecommendationService recommendationService;

    private UUID userId;
    private Product testProduct;
    private ProductCategory testCategory;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        
        testCategory = new ProductCategory();
        testCategory.setId(UUID.randomUUID());
        testCategory.setCategoryName("Electronics");

        testProduct = Product.builder()
                .withTitle("Test Product")
                .withDescription("Test Description")
                .withPrice(99.99)
                .withStock(10)
                .withImageUrl("http://test.com/image.jpg")
                .withSellerId(UUID.randomUUID())
                .withCategories(Set.of(testCategory))
                .build();
        testProduct.setId(UUID.randomUUID());
        testProduct.setCreatedAt(Timestamp.from(Instant.now()));
    }

    @Test
    void getRecommendationsForUser_WithPersonalizedRecommendations_ReturnsPersonalizedType() {
        // Given
        List<Product> personalizedProducts = List.of(testProduct);
        List<Object[]> categoryData = Collections.singletonList(new Object[]{"Electronics", 5});
        
        when(recommendationRepository.findRecommendedProductsForUser(userId, 10))
                .thenReturn(personalizedProducts);
        when(recommendationRepository.findUserPreferredCategories(userId))
                .thenReturn(categoryData);

        // When
        RecommendationDto result = recommendationService.getRecommendationsForUser(userId, 10);

        // Then
        assertNotNull(result);
        assertEquals("PERSONALIZED", result.getRecommendationType());
        assertEquals(1, result.getTotalRecommendations());
        assertEquals(1, result.getRecommendedProducts().size());
        assertEquals(1, result.getPreferredCategories().size());
        assertEquals(5, result.getPreferredCategories().get("Electronics"));

        verify(recommendationRepository).findRecommendedProductsForUser(userId, 10);
        verify(recommendationRepository).findUserPreferredCategories(userId);
        verify(recommendationRepository, never()).findPopularProducts(any(Integer.class));
    }

    @Test
    void getRecommendationsForUser_WithNoPersonalizedRecommendations_ReturnsPopularType() {
        // Given
        List<Product> emptyPersonalized = Collections.emptyList();
        List<Product> popularProducts = List.of(testProduct);
        List<Object[]> categoryData = Collections.emptyList();
        
        when(recommendationRepository.findRecommendedProductsForUser(userId, 10))
                .thenReturn(emptyPersonalized);
        when(recommendationRepository.findPopularProducts(10))
                .thenReturn(popularProducts);
        when(recommendationRepository.findUserPreferredCategories(userId))
                .thenReturn(categoryData);

        // When
        RecommendationDto result = recommendationService.getRecommendationsForUser(userId, 10);

        // Then
        assertNotNull(result);
        assertEquals("POPULAR", result.getRecommendationType());
        assertEquals(1, result.getTotalRecommendations());
        assertEquals(1, result.getRecommendedProducts().size());
        assertTrue(result.getPreferredCategories().isEmpty());

        verify(recommendationRepository).findRecommendedProductsForUser(userId, 10);
        verify(recommendationRepository).findPopularProducts(10);
        verify(recommendationRepository).findUserPreferredCategories(userId);
    }

    @Test
    void getRecommendationsForUser_WithMultipleCategories_ReturnsCorrectCategoryData() {
        // Given
        List<Product> personalizedProducts = List.of(testProduct);
        List<Object[]> categoryData = Arrays.asList(
                new Object[]{"Electronics", 5},
                new Object[]{"Books", 3},
                new Object[]{"Fashion", 2}
        );
        
        when(recommendationRepository.findRecommendedProductsForUser(userId, 10))
                .thenReturn(personalizedProducts);
        when(recommendationRepository.findUserPreferredCategories(userId))
                .thenReturn(categoryData);

        // When
        RecommendationDto result = recommendationService.getRecommendationsForUser(userId, 10);

        // Then
        assertNotNull(result);
        assertEquals(3, result.getPreferredCategories().size());
        assertEquals(5, result.getPreferredCategories().get("Electronics"));
        assertEquals(3, result.getPreferredCategories().get("Books"));
        assertEquals(2, result.getPreferredCategories().get("Fashion"));
    }

    @Test
    void getRecommendationsForUser_WithProductWithoutCategories_HandlesNullCategories() {
        // Given
        Product productWithoutCategories = Product.builder()
                .withTitle("Test Product")
                .withDescription("Test Description")
                .withPrice(99.99)
                .withStock(10)
                .withImageUrl("http://test.com/image.jpg")
                .withSellerId(UUID.randomUUID())
                .withCategories(null)
                .build();
        productWithoutCategories.setId(UUID.randomUUID());
        productWithoutCategories.setCreatedAt(Timestamp.from(Instant.now()));

        List<Product> personalizedProducts = List.of(productWithoutCategories);
        List<Object[]> categoryData = Collections.emptyList();
        
        when(recommendationRepository.findRecommendedProductsForUser(userId, 10))
                .thenReturn(personalizedProducts);
        when(recommendationRepository.findUserPreferredCategories(userId))
                .thenReturn(categoryData);

        // When
        RecommendationDto result = recommendationService.getRecommendationsForUser(userId, 10);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getRecommendedProducts().size());
        ProductDTO productDTO = result.getRecommendedProducts().get(0);
        assertNull(productDTO.categories());
    }

    @Test
    void getRecommendationsForUser_WithEmptyProducts_ReturnsEmptyRecommendations() {
        // Given
        List<Product> emptyPersonalized = Collections.emptyList();
        List<Product> emptyPopular = Collections.emptyList();
        List<Object[]> categoryData = Collections.emptyList();
        
        when(recommendationRepository.findRecommendedProductsForUser(userId, 10))
                .thenReturn(emptyPersonalized);
        when(recommendationRepository.findPopularProducts(10))
                .thenReturn(emptyPopular);
        when(recommendationRepository.findUserPreferredCategories(userId))
                .thenReturn(categoryData);

        // When
        RecommendationDto result = recommendationService.getRecommendationsForUser(userId, 10);

        // Then
        assertNotNull(result);
        assertEquals("POPULAR", result.getRecommendationType());
        assertEquals(0, result.getTotalRecommendations());
        assertTrue(result.getRecommendedProducts().isEmpty());
        assertTrue(result.getPreferredCategories().isEmpty());
    }

    @Test
    void getRecommendationsForUser_WithCustomLimit_UsesCorrectLimit() {
        // Given
        int customLimit = 5;
        List<Product> personalizedProducts = List.of(testProduct);
        List<Object[]> categoryData = Collections.emptyList();
        
        when(recommendationRepository.findRecommendedProductsForUser(userId, customLimit))
                .thenReturn(personalizedProducts);
        when(recommendationRepository.findUserPreferredCategories(userId))
                .thenReturn(categoryData);

        // When
        RecommendationDto result = recommendationService.getRecommendationsForUser(userId, customLimit);

        // Then
        assertNotNull(result);
        verify(recommendationRepository).findRecommendedProductsForUser(userId, customLimit);
    }

    @Test
    void convertToProductDTO_WithValidProduct_ReturnsCorrectDTO() {
        // Given
        List<Product> personalizedProducts = List.of(testProduct);
        List<Object[]> categoryData = Collections.emptyList();
        
        when(recommendationRepository.findRecommendedProductsForUser(userId, 10))
                .thenReturn(personalizedProducts);
        when(recommendationRepository.findUserPreferredCategories(userId))
                .thenReturn(categoryData);

        // When
        RecommendationDto result = recommendationService.getRecommendationsForUser(userId, 10);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getRecommendedProducts().size());
        
        ProductDTO productDTO = result.getRecommendedProducts().get(0);
        assertEquals(testProduct.getId(), productDTO.id());
        assertEquals(testProduct.getTitle(), productDTO.title());
        assertEquals(testProduct.getDescription(), productDTO.description());
        assertEquals(testProduct.getPrice(), productDTO.price());
        assertEquals(testProduct.getStock(), productDTO.stock());
        assertEquals(testProduct.getImageUrl(), productDTO.imageUrl());
        assertEquals(testProduct.getSellerId(), productDTO.sellerId());
        assertEquals(testProduct.getCreatedAt(), productDTO.createdAt());
        
        assertNotNull(productDTO.categories());
        assertEquals(1, productDTO.categories().size());
    }
} 