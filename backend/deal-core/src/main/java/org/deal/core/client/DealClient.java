package org.deal.core.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import okhttp3.Headers;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.deal.core.exception.DealException;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RequiredArgsConstructor
public class DealClient {
    private final OkHttpClient client;
    private final ObjectMapper objectMapper;
    private final DiscoveryClient discoveryClient;

    public <T> List<T> callListResponse(final DealService service,
                                        final String path,
                                        final HttpMethod httpMethod,
                                        final Class<T> clazz) throws DealException {
        return callListResponse(service, path, httpMethod, null, null, clazz);
    }

    public <T> List<T> callListResponse(final DealService service,
                                        final String path,
                                        final HttpMethod httpMethod,
                                        final RequestBody body,
                                        final Class<T> clazz) throws DealException {
        return callListResponse(service, path, httpMethod, body, null, clazz);
    }

    public <T> List<T> callListResponseAuthenticated(final DealService service,
                                                     final String path,
                                                     final HttpMethod httpMethod,
                                                     final String token,
                                                     final Class<T> clazz) throws DealException {
        return callListResponse(service, path, httpMethod, null, Headers.of(Map.of(HttpHeaders.AUTHORIZATION, "Bearer " + token)), clazz);
    }

    public <T> List<T> callListResponseAuthenticated(final DealService service,
                                                     final String path,
                                                     final HttpMethod httpMethod,
                                                     final RequestBody body,
                                                     final String token,
                                                     final Class<T> clazz) throws DealException {
        return callListResponse(service, path, httpMethod, body, Headers.of(Map.of(HttpHeaders.AUTHORIZATION, "Bearer " + token)), clazz);
    }

    public <T> List<T> callListResponse(final DealService service,
                                        final String path,
                                        final HttpMethod httpMethod,
                                        final RequestBody body,
                                        final Headers headers,
                                        final Class<T> clazz) throws DealException {
        String finalUrl = resolveUrl(service, path);

        Request request = new Request.Builder()
                .url(finalUrl)
                .method(httpMethod.toString(), body)
                .headers(Objects.isNull(headers) ? Headers.of() : headers)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new DealException("Call to service " + service + " was unsuccessful", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            JsonNode root = objectMapper.readTree(response.body().string());
            JsonNode payloadNode = root.get("payload");

            return objectMapper.readValue(
                    payloadNode.traverse(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, clazz));
        } catch (final IOException e) {
            throw new DealException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public <T> T call(final DealService service,
                      final String path,
                      final HttpMethod httpMethod,
                      final Class<T> clazz) throws DealException {
        return call(service, path, httpMethod, null, null, clazz);
    }

    public <T> T call(final DealService service,
                      final String path,
                      final HttpMethod httpMethod,
                      final RequestBody body,
                      final Class<T> clazz) throws DealException {
        return call(service, path, httpMethod, body, null, clazz);
    }

    public <T> T callAuthenticated(final DealService service,
                                   final String path,
                                   final HttpMethod httpMethod,
                                   final String token,
                                   final Class<T> clazz) throws DealException {
        return call(service, path, httpMethod, null, Headers.of(Map.of(HttpHeaders.AUTHORIZATION, "Bearer " + token)), clazz);
    }

    public <T> T callAuthenticated(final DealService service,
                                   final String path,
                                   final HttpMethod httpMethod,
                                   final RequestBody body,
                                   final String token,
                                   final Class<T> clazz) throws DealException {
        return call(service, path, httpMethod, body, Headers.of(Map.of(HttpHeaders.AUTHORIZATION, "Bearer " + token)), clazz);
    }

    public <T> T call(final DealService service,
                      final String path,
                      final HttpMethod httpMethod,
                      final RequestBody body,
                      final Headers headers,
                      final Class<T> clazz) throws DealException {
        String finalUrl = resolveUrl(service, path);

        Request request = new Request.Builder()
                .url(finalUrl)
                .method(httpMethod.toString(), body)
                .headers(headers)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new DealException("Call to service " + service + " was unsuccessful", HttpStatus.INTERNAL_SERVER_ERROR);
            }

            JsonNode root = objectMapper.readTree(response.body().string());
            JsonNode payloadNode = root.get("payload");

            return objectMapper.treeToValue(payloadNode, clazz);
        } catch (final IOException e) {
            throw new DealException(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String resolveUrl(final DealService service, final String path) {
        List<ServiceInstance> instances = discoveryClient.getInstances(service.getValue());
        ServiceInstance instance = instances.get(0);
        String url = instance.getUri().toString();

        return url + path;
    }
}
