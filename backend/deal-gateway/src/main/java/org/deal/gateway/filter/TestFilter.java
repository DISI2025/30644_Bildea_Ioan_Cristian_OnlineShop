package org.deal.gateway.filter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.deal.core.client.DealClient;
import org.deal.core.client.DealService;
import org.deal.core.dto.UserDTO;
import org.deal.core.exception.DealException;
import org.deal.core.util.Mapper;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Component
public class TestFilter implements GlobalFilter, Ordered {
    private final DealClient dealClient;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("[INCOMING] {}", exchange.getRequest().getURI());

        try {
            List<UserDTO> users = dealClient.callListResponse(DealService.IS, "/users", HttpMethod.GET, UserDTO.class);
            log.info("Users: {}", users);
        } catch (DealException e) {
            return handleBadRequest(exchange, e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1;
    }

    private Mono<Void> handleBadRequest(final ServerWebExchange exchange, final String message, final HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        DataBuffer dataBuffer = response.bufferFactory().wrap(
                Mapper.writeValueAsBytes(
                        Map.of("status", status, "message", "Failure", "error", message)
                ));

        return response.writeWith(Mono.just(dataBuffer));
    }
}
