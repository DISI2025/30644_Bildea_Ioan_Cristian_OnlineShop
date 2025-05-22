package org.deal.productservice.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.deal.core.client.DealClient;
import org.deal.core.client.DealService;
import org.deal.core.dto.UserDTO;
import org.deal.core.exception.DealError;
import org.deal.core.exception.DealException;
import org.deal.core.request.auth.ValidateTokenRequest;
import org.deal.core.response.DealResponse;
import org.deal.productservice.security.DealContext;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.server.PathContainer;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.pattern.PathPatternParser;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${whitelisted-paths}")
    private List<String> whitelistedPaths;

    private final ObjectMapper objectMapper;
    private final DealClient dealClient;
    private final DealContext dealContext;
    private final PathPatternParser pathPatternParser;

    @SneakyThrows
    @Override
    protected void doFilterInternal(
            @NonNull final HttpServletRequest request,
            @NonNull final HttpServletResponse response,
            @NonNull final FilterChain filterChain) {
        log.info("[AuthFilter] {} {}", request.getMethod(), request.getRequestURI());
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (!isValidHeader(authHeader)) {
            handleInvalidAuth(response, DealError.BAD_TOKEN, HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        String jwtToken = getJwtFromHeader(authHeader);
        try {
            UserDTO principal = dealClient.call(DealService.IS, "/auth/validate-token", HttpMethod.POST, new ValidateTokenRequest(jwtToken), UserDTO.class);
            dealContext.setUser(principal);
        } catch (DealException e) {
            log.error("[AuthFilter] {}", e.getMessage());
            handleInvalidAuth(response, DealError.BAD_CREDENTIAL_EXCEPTION, HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isValidHeader(final String header) {
        return StringUtils.isNotBlank(header) && header.startsWith("Bearer ");
    }

    private String getJwtFromHeader(final String header) {
        return header.substring(7);
    }

    @SneakyThrows
    private void handleInvalidAuth(final HttpServletResponse response, final DealError error, final int status) {
        var res = DealResponse.failureResponse(error);

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(status);
        response.getWriter().write(objectMapper.writeValueAsString(res.getBody()));
        response.getWriter().flush();
    }

    @Override
    protected boolean shouldNotFilter(@NotNull final HttpServletRequest request) {
        return whitelistedPaths.stream()
                .map(pathPatternParser::parse)
                .anyMatch(pattern -> pattern.matches(PathContainer.parsePath(request.getRequestURI())));
    }
}
