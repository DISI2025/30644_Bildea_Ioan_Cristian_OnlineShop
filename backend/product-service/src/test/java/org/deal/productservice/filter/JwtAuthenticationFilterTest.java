package org.deal.productservice.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.SneakyThrows;
import org.deal.core.client.DealClient;
import org.deal.core.client.DealService;
import org.deal.core.dto.UserDTO;
import org.deal.core.exception.DealException;
import org.deal.core.request.auth.ValidateTokenRequest;
import org.deal.productservice.security.DealContext;
import org.instancio.Instancio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.util.pattern.PathPattern;
import org.springframework.web.util.pattern.PathPatternParser;

import java.io.PrintWriter;
import java.util.List;

import static jakarta.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
import static jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    private static final List<String> WHITELISTED_PATHS = List.of("/swagger-ui/**");
    private static final String VALID_PATH = "/swagger-ui/index.html";
    private static final String WROTE_OBJ = "mockObj";
    private static final String HEADER = "Bearer token";

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private DealClient dealClient;

    @Mock
    private DealContext dealContext;

    @Mock
    private PathPatternParser pathPatternParser;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain chain;

    @InjectMocks
    private JwtAuthenticationFilter victim;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(victim, "whitelistedPaths", WHITELISTED_PATHS);
    }

    @Test
    void testShouldNotFilter_whitelistedPath() {
        var pathPattern = mock(PathPattern.class);
        when(request.getRequestURI()).thenReturn(VALID_PATH);
        when(pathPatternParser.parse(anyString())).thenReturn(pathPattern);
        when(pathPattern.matches(any())).thenReturn(true);

        boolean result = victim.shouldNotFilter(request);

        assertThat(result, equalTo(true));
    }

    @Test
    void testShouldNotFilter_notWhitelistedPath() {
        var pathPattern = mock(PathPattern.class);
        when(request.getRequestURI()).thenReturn(VALID_PATH);
        when(pathPatternParser.parse(anyString())).thenReturn(pathPattern);
        when(pathPattern.matches(any())).thenReturn(false);

        boolean result = victim.shouldNotFilter(request);

        assertThat(result, equalTo(false));
    }

    @SneakyThrows
    @Test
    void testDoFilterInternal_invalidHeader_shouldStopFiltering() {
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);
        var mockWriter = mockReturnedResponse();

        victim.doFilterInternal(request, response, chain);

        verify(chain, never()).doFilter(request, response);
        verifyReturnedResponse(mockWriter, SC_BAD_REQUEST);
    }

    @SneakyThrows
    @Test
    void testDoFilterInternal_successfulAuthCall_shouldAuthenticate() {
        var principal = Instancio.create(UserDTO.class);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(HEADER);
        when(dealClient.call(any(), anyString(), any(), any(), any())).thenReturn(principal);

        victim.doFilterInternal(request, response, chain);

        verify(dealClient).call(DealService.IS, "/auth/validate-token", HttpMethod.POST, new ValidateTokenRequest("token"), UserDTO.class);
        verify(dealContext).setUser(principal);
        verify(chain).doFilter(request, response);
    }

    @SneakyThrows
    @Test
    void testDoFilterInternal_unsuccessfulAuthCall_shouldStopFiltering() {
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(HEADER);
        doThrow(new DealException("", HttpStatus.UNAUTHORIZED)).when(dealClient).call(any(), anyString(), any(), any(), any());
        var mockWriter = mockReturnedResponse();

        victim.doFilterInternal(request, response, chain);

        verify(dealClient).call(DealService.IS, "/auth/validate-token", HttpMethod.POST, new ValidateTokenRequest("token"), UserDTO.class);
        verify(dealContext, never()).setUser(any());
        verify(chain, never()).doFilter(request, response);
        verifyReturnedResponse(mockWriter, SC_UNAUTHORIZED);
    }

    @SneakyThrows
    private PrintWriter mockReturnedResponse() {
        var mockPrinter = mock(PrintWriter.class);
        when(response.getWriter()).thenReturn(mockPrinter);
        when(objectMapper.writeValueAsString(any())).thenReturn(WROTE_OBJ);
        return mockPrinter;
    }

    @SneakyThrows
    private void verifyReturnedResponse(final PrintWriter writer, final int status) {
        verify(chain, never()).doFilter(request, response);
        verify(response).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(response).setStatus(status);
        verify(writer).write(WROTE_OBJ);
        verify(writer).flush();
    }
}