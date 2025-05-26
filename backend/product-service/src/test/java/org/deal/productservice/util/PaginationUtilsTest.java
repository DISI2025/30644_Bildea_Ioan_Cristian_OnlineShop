package org.deal.productservice.util;

import jakarta.servlet.http.HttpServletRequest;
import org.deal.core.request.product.ProductsFilter;
import org.deal.core.response.PaginationDetails;
import org.deal.core.util.SortDir;
import org.deal.productservice.entity.Product;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Map;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaginationUtilsTest {

    @Mock
    private HttpServletRequest request;

    @Test
    void testBuildPageUrl_withParameters_shouldReturnCorrectUrl() {
        when(request.getRequestURL()).thenReturn(new StringBuffer("http://localhost/api"));
        when(request.getParameterMap()).thenReturn(Map.of(
                "property", new String[]{"title"},
                "sort", new String[]{"ASC"},
                "search", new String[]{"test"}
        ));

        String url = PaginationUtils.buildPageUrl(request, 1, 10);

        assertThat(url, equalTo("http://localhost/api?page=1&size=10&property=title&search=test&sort=ASC"));
    }

    @Test
    void testBuildPaginationDetails_withValidPage_shouldReturnCorrectDetails() {
        var content = List.of("item1", "item2");
        var pageable = PageRequest.of(1, 5);
        var page = new PageImpl<>(content, pageable, 12);

        when(request.getRequestURL()).thenReturn(new StringBuffer("http://localhost/api"));
        when(request.getParameterMap()).thenReturn(Map.of());

        var details = PaginationUtils.buildPaginationDetails(page, request, 5);

        assertThat(details.page(), equalTo(1));
        assertThat(details.size(), equalTo(5));
        assertThat(details.totalElements(), equalTo(12L));
        assertThat(details.totalPages(), equalTo(3));
        assertThat(details.hasNext(), equalTo(true));
        assertThat(details.hasPrevious(), equalTo(true));
        assertThat(details.nextPageUrl(), notNullValue());
        assertThat(details.previousPageUrl(), notNullValue());
    }

    @Test
    void testBuildPageableRequest_withFilter_shouldReturnCorrectPageable() {
        var filter = new ProductsFilter("title", "test", SortDir.DESC, 1, 10);

        var pageable = PaginationUtils.buildPageableRequest(filter);

        assertThat(pageable.getPageNumber(), equalTo(1));
        assertThat(pageable.getPageSize(), equalTo(10));
        assertThat(pageable.getSort(), equalTo(Sort.by(Sort.Direction.DESC, "title")));
    }

    @Test
    void testBuildSpecification_withSearchValue_shouldReturnValidSpecification() {
        var filter = new ProductsFilter("title", "test", SortDir.ASC, 0, 10);

        Specification<Product> spec = PaginationUtils.buildSpecification(filter);

        assertThat(spec, notNullValue());
    }
} 