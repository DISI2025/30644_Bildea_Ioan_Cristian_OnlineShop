package org.deal.productservice.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.deal.core.dto.ProductDTO;
import org.deal.core.request.product.ProductsFilter;
import org.deal.core.response.PaginationDetails;
import org.deal.core.util.SortDir;
import org.deal.productservice.service.RecommendationService;
import org.deal.productservice.service.TrackingFacade;
import org.instancio.Instancio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.deal.productservice.util.TestUtils.ResponseUtils.assertThatPaginatedResponseIsSuccessful;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RecommendationControllerTest {

    @Mock
    private RecommendationService recommendationService;

    @Mock
    private TrackingFacade trackingFacade;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private RecommendationController victim;

    @Test
    void testTrackProductView_shouldReturnSuccess() {
        var userId = UUID.randomUUID();
        var productId = UUID.randomUUID();

        var response = victim.trackProductView(userId, productId);

        verify(trackingFacade).trackProductView(userId, productId);
        assertThat(response.getStatus(), equalTo(HttpStatus.OK));
    }

    @Test
    void testGetRecommendedProducts_shouldReturnPaginatedResponseWithCorrectData() {
        var productDTO1 = Instancio.create(ProductDTO.class);
        var productDTO2 = Instancio.create(ProductDTO.class);
        var content = List.of(productDTO1, productDTO2);
        int currentPage = 1;
        int pageSize = 5;
        int totalPages = 3;
        long totalElements = 12;
        var userId = UUID.randomUUID();
        var page = new PageImpl<>(content, PageRequest.of(currentPage, pageSize), totalElements);
        var filter = new ProductsFilter("title", "", SortDir.ASC, currentPage, pageSize);

        when(recommendationService.getRecommendedProducts(userId, filter)).thenReturn(page);
        when(request.getRequestURL()).thenReturn(new StringBuffer("http://localhost/recommendations"));
        when(request.getParameterMap()).thenReturn(Map.of(
                "property", new String[]{"title"},
                "page", new String[]{String.valueOf(currentPage)},
                "size", new String[]{String.valueOf(pageSize)},
                "sort", new String[]{"ASC"}
        ));

        var response = victim.getRecommendedProducts(userId, filter, request);

        verify(recommendationService).getRecommendedProducts(userId, filter);
        assertThatPaginatedResponseIsSuccessful(response, content,
                                                PaginationDetails.builder()
                                                        .withPage(currentPage)
                                                        .withSize(filter.size())
                                                        .withTotalElements(page.getTotalElements())
                                                        .withTotalPages(totalPages)
                                                        .withHasNext(page.hasNext())
                                                        .withHasPrevious(page.hasPrevious())
                                                        .withNextPageUrl("http://localhost/recommendations?page=2&size=5&property=title&sort=ASC")
                                                        .withPreviousPageUrl("http://localhost/recommendations?page=0&size=5&property=title&sort=ASC")
                                                        .build());
    }
} 