package org.deal.notificationservice.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.SneakyThrows;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.PrintWriter;

import static jakarta.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
import static jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class BaseTokenAuthenticationFilterTest {

    private static final String BASE_TOKEN = "secret-token";
    private static final String VALID_HEADER = "Basic " + BASE_TOKEN;
    private static final String INVALID_HEADER = "Basic invalid-token";
    private static final String WRONG_PREFIX_HEADER = "Bearer " + BASE_TOKEN;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private BaseTokenAuthenticationFilter filter;

    @BeforeEach
    void setup() {
        // Inject baseToken value
        org.springframework.test.util.ReflectionTestUtils.setField(filter, "baseToken", BASE_TOKEN);
    }

    @Test
    void shouldNotFilter_returnsTrueForWsNotificationsPath() {
        when(request.getRequestURI()).thenReturn("/ws-notifications/something");

        boolean result = filter.shouldNotFilter(request);

        assertThat(result, CoreMatchers.equalTo(true));
    }

    @Test
    void shouldNotFilter_returnsFalseForOtherPaths() {
        when(request.getRequestURI()).thenReturn("/api/secure");

        boolean result = filter.shouldNotFilter(request);

        assertThat(result, CoreMatchers.equalTo(false));
    }

    @SneakyThrows
    @Test
    void doFilterInternal_nullHeader_returnsBadRequest() {
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);
        PrintWriter writer = mockResponseWriter();

        filter.doFilterInternal(request, response, filterChain);

        verify(response).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(response).setStatus(SC_BAD_REQUEST);
        verify(writer).write(anyString());
        verify(writer).flush();
        verify(filterChain, never()).doFilter(any(), any());
    }

    @SneakyThrows
    @Test
    void doFilterInternal_wrongPrefixHeader_returnsBadRequest() {
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(WRONG_PREFIX_HEADER);
        PrintWriter writer = mockResponseWriter();

        filter.doFilterInternal(request, response, filterChain);

        verify(response).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(response).setStatus(SC_BAD_REQUEST);
        verify(writer).write(anyString());
        verify(writer).flush();
        verify(filterChain, never()).doFilter(any(), any());
    }

    @SneakyThrows
    @Test
    void doFilterInternal_invalidToken_returnsUnauthorized() {
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(INVALID_HEADER);
        PrintWriter writer = mockResponseWriter();

        filter.doFilterInternal(request, response, filterChain);

        verify(response).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(response).setStatus(SC_UNAUTHORIZED);
        verify(writer).write(anyString());
        verify(writer).flush();
        verify(filterChain, never()).doFilter(any(), any());
    }

    @SneakyThrows
    @Test
    void doFilterInternal_validToken_callsFilterChain() {
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(VALID_HEADER);

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verify(response, never()).setStatus(anyInt());
    }

    @SneakyThrows
    private PrintWriter mockResponseWriter() {
        PrintWriter writer = mock(PrintWriter.class);
        when(response.getWriter()).thenReturn(writer);
        // Mock ObjectMapper to return a dummy JSON string
        when(objectMapper.writeValueAsString(any())).thenReturn("{\"error\":\"mocked\"}");
        return writer;
    }
}