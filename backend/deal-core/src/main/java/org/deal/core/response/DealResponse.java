package org.deal.core.response;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.servlet.http.HttpServletResponse;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import org.deal.core.exception.DealError;
import org.deal.core.util.Mapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.deal.core.util.Constants.FAILURE;
import static org.deal.core.util.Constants.SUCCESS;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Getter
@EqualsAndHashCode(callSuper = true)
@ToString
public class DealResponse<T> extends ResponseEntity<Object> implements Serializable {

    private final Map<String, Object> body;
    private final String message;
    private final HttpStatus status;
    private final HttpHeaders headers;

    @JsonCreator
    public DealResponse(final Map<String, Object> body, final String message, final HttpStatus status, final HttpHeaders headers) {
        super(body, headers, status);
        this.body = body;
        this.message = message;
        this.status = status;
        this.headers = headers;
    }

    private DealResponse(final Builder<T> builder) {
        super(builder.body, builder.headers, builder.status);

        this.body = builder.body;
        this.status = builder.status;
        this.message = builder.message;
        this.headers = builder.headers;
    }

    public static <T> DealResponse<T> successResponse(final T payload) {
        return baseResponse(payload, SUCCESS, HttpStatus.OK, getDefaultHttpHeaders(), null);
    }

    public static <T> DealResponse<T> successPaginatedResponse(final T payload, final PaginationDetails pagination) {
        return basePaginatedResponse(payload, SUCCESS, HttpStatus.OK, getDefaultHttpHeaders(), null, pagination);
    }

    public static <T> DealResponse<T> successResponse(final T payload, final String headerKey, final String headerValue) {
        HttpHeaders headers = getDefaultHttpHeaders();
        headers.add(headerKey, headerValue);
        return baseResponse(payload, SUCCESS, HttpStatus.OK, headers, null);
    }

    public static <T> DealResponse<T> successResponse(final T payload, final HttpStatus status) {
        return baseResponse(payload, SUCCESS, status, getDefaultHttpHeaders(), null);
    }

    public static <T> DealResponse<T> failureResponse(final DealError error) {
        return failureResponse(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static <T> DealResponse<T> failureResponse(final DealError error, final HttpStatus status) {
        return baseResponse(null, FAILURE, status, getDefaultHttpHeaders(), List.of(error));
    }

    public static <T> DealResponse<T> baseResponse(
            final T payload,
            final String message,
            final HttpStatus status,
            final HttpHeaders headers,
            final List<DealError> errors) {
        return new DealResponse.Builder<T>()
                .withStatus(status)
                .withPayload(payload)
                .withMessage(message)
                .withHeaders(headers)
                .withErrors(errors)
                .build();
    }

    public static <T> DealResponse<T> basePaginatedResponse(
            final T payload,
            final String message,
            final HttpStatus status,
            final HttpHeaders headers,
            final List<DealError> errors,
            final PaginationDetails pagination) {
        return new DealResponse.Builder<T>()
                .withStatus(status)
                .withPayload(payload)
                .withMessage(message)
                .withHeaders(headers)
                .withErrors(errors)
                .withPaginationDetails(pagination)
                .build();
    }

    private static HttpHeaders getDefaultHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_TYPE, APPLICATION_JSON_VALUE);
        return headers;
    }

    private static final class Builder<T> {
        private final Map<String, Object> body = new HashMap<>();
        private String message;
        private HttpStatus status;
        private final HttpHeaders headers = new HttpHeaders();

        public Builder<T> withMessage(String message) {
            this.message = message;
            this.body.put("message", message);
            return this;
        }

        public Builder<T> withStatus(final HttpStatus status) {
            this.status = status;
            this.body.put("status", status);
            return this;
        }

        public Builder<T> withErrors(final List<DealError> errors) {
            this.body.put("errors", errors);
            return this;
        }

        public Builder<T> withPayload(final T payload) {
            this.body.put("payload", payload);
            return this;
        }

        public Builder<T> withHeaders(final HttpHeaders headers) {
            this.headers.putAll(headers);
            return this;
        }

        public Builder<T> withPaginationDetails(final PaginationDetails details) {
            this.body.put("pagination", details);
            return this;
        }

        public DealResponse<T> build() {
            return new DealResponse<>(this);
        }
    }
}
