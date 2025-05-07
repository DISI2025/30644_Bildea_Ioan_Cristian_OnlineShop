package org.deal.identityservice.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.SneakyThrows;
import org.deal.core.service.JwtService;
import org.deal.core.util.Role;
import org.deal.identityservice.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.util.pattern.PathPattern;
import org.springframework.web.util.pattern.PathPatternParser;

import java.io.PrintWriter;
import java.util.List;
import java.util.Optional;

import static jakarta.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
import static jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED;
import static org.deal.identityservice.util.TestUtils.UserUtils.randomUser;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    private static final List<String> WHITELISTED_PATHS = List.of("/auth/**");
    private static final String VALID_PATH = "/auth/login";
    private static final String INVALID_PATH = "/invalid";
    private static final String WROTE_OBJ = "mockObj";
    private static final String HEADER = "Bearer token";
    private static final String USERNAME = "username";

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserService userService;

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
        SecurityContextHolder.clearContext();
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
        when(request.getRequestURI()).thenReturn(INVALID_PATH);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);
        var mockWriter = mockReturnedResponse();

        victim.doFilterInternal(request, response, chain);

        verifyReturnedResponse(mockWriter, SC_BAD_REQUEST);
    }

    @Test
    void testDoFilterInternal_emptyUsername_shouldStopFiltering() {
        when(request.getRequestURI()).thenReturn(VALID_PATH);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(HEADER);
        when(jwtService.extractUsername(anyString())).thenReturn(Optional.empty());
        var mockWriter = mockReturnedResponse();

        victim.doFilterInternal(request, response, chain);

        verifyReturnedResponse(mockWriter, SC_BAD_REQUEST);
    }

    @MockitoSettings(strictness = Strictness.LENIENT)
    @Test
    void testDoFilterInternal_invalidToken_shouldStopFiltering() {
        when(request.getRequestURI()).thenReturn(VALID_PATH);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(HEADER);
        when(jwtService.extractUsername(anyString())).thenReturn(Optional.of(USERNAME));
        when(jwtService.isValidToken(anyString(), any(), eq(USERNAME), any(Role.class))).thenReturn(false);
        var mockWriter = mockReturnedResponse();

        victim.doFilterInternal(request, response, chain);

        verifyReturnedResponse(mockWriter, SC_UNAUTHORIZED);
    }

    @SneakyThrows
    @Test
    void testDoFilterInternal_valid_shouldAuthenticate() {
        JwtAuthenticationFilter spyFilter = spy(victim);
        when(request.getRequestURI()).thenReturn(VALID_PATH);
        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(HEADER);
        when(jwtService.extractUsername(anyString())).thenReturn(Optional.of(USERNAME));
        when(jwtService.isValidToken(anyString(), any(), anyString(), any())).thenReturn(true);
        when(userService.loadUserByUsername(USERNAME)).thenReturn(randomUser());
        var mockContext = mock(SecurityContext.class);
        var mockAuth = mock(Authentication.class);
        when(mockContext.getAuthentication()).thenReturn(mockAuth);
        when(mockAuth.getName()).thenReturn("");
        SecurityContextHolder.setContext(mockContext);

        spyFilter.doFilterInternal(request, response, chain);

        verify(chain).doFilter(request, response);
        verify(spyFilter).authenticate(any(UserDetails.class), eq(request));
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
