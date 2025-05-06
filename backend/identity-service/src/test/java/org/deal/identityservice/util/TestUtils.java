package org.deal.identityservice.util;

import org.deal.core.dto.UserDTO;
import org.deal.core.exception.DealError;
import org.deal.core.request.login.LoginRequest;
import org.deal.core.request.user.CreateUserRequest;
import org.deal.core.request.user.UpdateUserRequest;
import org.deal.core.response.DealResponse;
import org.deal.core.response.login.LoginResponse;
import org.deal.core.util.Mapper;
import org.deal.core.util.Role;
import org.deal.identityservice.entity.User;
import org.junit.jupiter.api.Assertions;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    public interface UserUtils {
        static User randomUser() {
            return new User(UUID.randomUUID(), randomString(), randomString(), Role.USER);
        }

        static UserDTO randomUserDTO() {
            return new UserDTO(UUID.randomUUID(), randomString(), Role.USER);
        }

        static CreateUserRequest createUserRequest(final User user) {
            return new CreateUserRequest(
                    user.getUsername(),
                    user.getPassword(),
                    user.getRole()
            );
        }

        static UpdateUserRequest updateUserRequest(final User user) {
            return new UpdateUserRequest(
                    user.getId(),
                    user.getUsername()
            );
        }
    }

    public interface LoginUtils {
        static LoginRequest randomLoginRequest() {
            return new LoginRequest(randomString(), randomString());
        }

        static LoginResponse randomLoginResponse() {
            return new LoginResponse(randomString(), UserUtils.randomUserDTO());
        }
    }
}
