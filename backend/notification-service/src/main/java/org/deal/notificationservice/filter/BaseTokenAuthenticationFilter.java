package org.deal.notificationservice.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.deal.core.exception.DealError;
import org.deal.core.response.DealResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
@RequiredArgsConstructor
@Slf4j
public class BaseTokenAuthenticationFilter extends OncePerRequestFilter {

    @Value("${base-token}")
    private String baseToken;

    private final ObjectMapper objectMapper;

    @SneakyThrows
    @Override
    protected void doFilterInternal(
            final @NonNull HttpServletRequest request,
            final @NonNull HttpServletResponse response,
            final @NonNull FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (!isValidHeader(authHeader)) {
            handleInvalidAuth(response, DealError.BAD_TOKEN, HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        String tokenFromHeader = getTokenFromHeader(authHeader).trim();

        if (!baseToken.equals(tokenFromHeader)) {
            handleInvalidAuth(response, DealError.BAD_CREDENTIAL_EXCEPTION, HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isValidHeader(final String header) {
        return StringUtils.isNotBlank(header) && header.startsWith("Basic ");
    }

    private String getTokenFromHeader(final String header) {
        return header.substring(6);
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
        if (request.getRequestURI().startsWith("/ws-notifications")) {
            return true;
        }
        return false;
    }

}
