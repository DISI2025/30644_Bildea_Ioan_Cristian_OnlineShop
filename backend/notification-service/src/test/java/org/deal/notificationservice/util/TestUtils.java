package org.deal.notificationservice.util;

import org.deal.core.exception.DealError;
import org.deal.core.response.DealResponse;
import org.deal.core.response.PaginationDetails;
import org.deal.core.util.Mapper;
import org.junit.jupiter.api.Assertions;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.deal.core.util.Constants.FAILURE;
import static org.deal.core.util.Constants.SUCCESS;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;

public class TestUtils {

    public static String randomString() {
        return UUID.randomUUID().toString().replaceAll("_", "");
    }

    public static <T, U> List<U> convertAll(final List<T> data, final Class<U> clazz) {
        return data.stream().map(element -> Mapper.mapTo(element, clazz)).toList();
    }
    public static <T, U> Set<U> convertAll(final Set<T> data, final Class<U> clazz) {
        return data.stream().map(element -> Mapper.mapTo(element, clazz)).collect(Collectors.toSet());
    }

    public interface ResponseUtils {
        static <T> void assertThatResponseIsSuccessful(final DealResponse<T> response, final T expectedData) {
            Optional.ofNullable(response.getBody().get("payload")).ifPresentOrElse(
                    payload -> {
                        assertThat(payload, equalTo(expectedData));
                        assertThat(response.getStatus(), equalTo(HttpStatus.OK));
                        assertThat(response.getMessage(), equalTo(SUCCESS));
                    },
                    Assertions::fail
            );
        }

        static <T> void assertThatPaginatedResponseIsSuccessful(final DealResponse<T> response, final T expectedData, final PaginationDetails details) {
            Optional.ofNullable(response.getBody().get("payload")).ifPresentOrElse(
                    payload -> {
                        assertThat(payload, equalTo(expectedData));
                        assertThat(response.getStatus(), equalTo(HttpStatus.OK));
                        assertThat(response.getMessage(), equalTo(SUCCESS));
                        assertThat(response.getBody().get("pagination"), equalTo(details));
                    },
                    Assertions::fail
            );
        }

        static void assertThatResponseFailed(
                final DealResponse<?> response,
                final List<DealError> expectedErrors,
                final HttpStatus expectedStatus) {
            Optional.ofNullable(response.getBody().get("errors")).ifPresentOrElse(
                    errors -> {
                        assertThat(errors, equalTo(expectedErrors));
                        assertThat(response.getStatus(), equalTo(expectedStatus));
                        assertThat(response.getMessage(), equalTo(FAILURE));
                    },
                    Assertions::fail
            );
        }
    }
}
