package org.deal.identityservice.util;

import org.deal.core.dto.UserDTO;
import org.deal.core.exception.DealError;
import org.deal.core.request.auth.LoginRequest;
import org.deal.core.request.user.CreateUserRequest;
import org.deal.core.request.user.UpdateUserRequest;
import org.deal.core.response.DealResponse;
import org.deal.core.response.auth.AuthResponse;
import org.deal.core.util.Mapper;
import org.deal.core.util.Role;
import org.deal.identityservice.entity.PasswordToken;
import org.deal.identityservice.entity.User;
import org.junit.jupiter.api.Assertions;
import org.springframework.http.HttpStatus;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.deal.core.util.Constants.FAILURE;
import static org.deal.core.util.Constants.SUCCESS;
import static org.deal.identityservice.util.TestUtils.UserUtils.randomUser;
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

        static <T> void assertThatResponseIsSuccessful(final DealResponse<T> response) {
            Optional.ofNullable(response.getBody().get("payload")).ifPresentOrElse(
                    payload -> {
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
            return new User(
                    UUID.randomUUID(),
                    randomString(),
                    randomString(),
                    truncateNanos(Timestamp.from(Instant.now())),
                    randomString(),
                    Role.USER,
                    Set.of(UUID.randomUUID(), UUID.randomUUID()),
                    randomString(),
                    randomString(),
                    randomString(),
                    randomString(),
                    randomString(),
                    randomString(),
                    randomString(),
                    randomString()
            );

        }

        static UserDTO randomUserDTO() {
            return Mapper.mapTo(randomUser(), UserDTO.class);
        }

        static UserDTO randomUserDTO(final String email) {
            var user = randomUser();
            user.setEmail(email);
            return Mapper.mapTo(user, UserDTO.class);
        }

        static CreateUserRequest createUserRequest(final User user) {
            return new CreateUserRequest(
                    user.getUsername(),
                    user.getPassword(),
                    user.getEmail(),
                    user.getRole()
            );
        }

        static UpdateUserRequest updateUserRequest(final User user) {
            return new UpdateUserRequest(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole()
            );
        }


        static Timestamp truncateNanos(final Timestamp timestamp) {
            return Timestamp.valueOf(timestamp.toLocalDateTime().withNano(0));
        }
    }

    public interface AuthUtils {
        static LoginRequest randomLoginRequest() {
            return new LoginRequest(randomString(), randomString());
        }

        static LoginRequest loginRequest(final User user) {
            return new LoginRequest(user.getUsername(), user.getPassword());
        }

        static AuthResponse prepareAuthResponse(final String username, final String token) {
            var user = randomUser();
            user.setUsername(username);


            return AuthResponse.builder()
                    .withAccessToken(token)
                    .withUser(Mapper.mapTo(user, UserDTO.class))
                    .build();
        }

        static PasswordToken randomPasswordToken() {
            return new PasswordToken(
                    UUID.randomUUID(),
                    randomString(),
                    UUID.randomUUID(),
                    LocalDateTime.now()
            );
        }
    }
}
