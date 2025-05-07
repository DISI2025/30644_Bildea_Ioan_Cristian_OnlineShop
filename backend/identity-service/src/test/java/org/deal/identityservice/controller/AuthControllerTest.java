package org.deal.identityservice.controller;

import org.deal.core.exception.DealError;
import org.deal.identityservice.service.AuthService;
import org.deal.identityservice.util.BaseUnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

import static org.deal.identityservice.util.TestUtils.AuthUtils.prepareAuthResponse;
import static org.deal.identityservice.util.TestUtils.AuthUtils.randomLoginRequest;
import static org.deal.identityservice.util.TestUtils.ResponseUtils.assertThatResponseFailed;
import static org.deal.identityservice.util.TestUtils.ResponseUtils.assertThatResponseIsSuccessful;
import static org.deal.identityservice.util.TestUtils.UserUtils.createUserRequest;
import static org.deal.identityservice.util.TestUtils.UserUtils.randomUser;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest extends BaseUnitTest {

    private static final String TOKEN = "mockToken";

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController victim;

    @Test
    void testLogin_validCredentials_shouldReturnSuccess() {
        var request = randomLoginRequest();
        var expectedResponse = prepareAuthResponse(request.username(), TOKEN);
        when(authService.authenticate(request)).thenReturn(Optional.of(expectedResponse));

        var response = victim.login(request);

        verify(authService).authenticate(request);
        assertThatResponseIsSuccessful(response, expectedResponse);
    }

    @Test
    void testLogin_invalidCredentials_shouldReturnFailure() {
        when(authService.authenticate(any())).thenReturn(Optional.empty());

        var response = victim.login(randomLoginRequest());

        verify(authService).authenticate(any());
        assertThatResponseFailed(response, List.of(DealError.BAD_CREDENTIAL_EXCEPTION), HttpStatus.UNAUTHORIZED);
    }

    @Test
    void testRegister_userIsCreated_shouldReturnSuccess() {
        var request = createUserRequest(randomUser());
        var expectedResponse = prepareAuthResponse(request.username(), TOKEN);
        when(authService.register(request)).thenReturn(Optional.of(expectedResponse));

        var response = victim.register(request);

        verify(authService).register(request);
        assertThatResponseIsSuccessful(response, expectedResponse);
    }

    @Test
    void testRegister_userIsNotCreated_shouldReturnFailure() {
        when(authService.register(any())).thenReturn(Optional.empty());

        var response = victim.register(createUserRequest(randomUser()));

        assertThatResponseFailed(response, List.of(DealError.REGISTRATION_FAILED), HttpStatus.BAD_REQUEST);
    }
}
