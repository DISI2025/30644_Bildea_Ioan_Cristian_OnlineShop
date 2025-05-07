package org.deal.identityservice.controller;

import org.deal.core.exception.DealError;
import org.deal.core.request.password.ForgotPasswordRequest;
import org.deal.core.request.password.ResetPasswordRequest;
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
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest extends BaseUnitTest {

    private static final String TOKEN = "mockToken";
    private static final String EMAIL = "mockEmail";
    private static final String PASSWORD = "passw";

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

    @Test
    void testForgotPassword_shouldReturnSuccess() {
        var request = new ForgotPasswordRequest(EMAIL);
        when(authService.forgotPassword(EMAIL)).thenReturn(true);

        var response = victim.forgotPassword(request);

        assertThat(response.getStatus(), equalTo(HttpStatus.OK));
    }

    @Test
    void testForgotPassword_shouldReturnFailure() {
        var request = new ForgotPasswordRequest(EMAIL);
        when(authService.forgotPassword(EMAIL)).thenReturn(false);

        var response = victim.forgotPassword(request);

        assertThat(response.getStatus(), equalTo(HttpStatus.BAD_REQUEST));
    }

    @Test
    void testResetPassword_shouldReturnSuccess() {
        var request = new ResetPasswordRequest(TOKEN, PASSWORD);
        when(authService.resetPassword(TOKEN, PASSWORD)).thenReturn(true);

        var response = victim.resetPassword(request);

        assertThat(response.getStatus(), equalTo(HttpStatus.OK));
    }

    @Test
    void testResetPassword_shouldReturnFailure() {
        var request = new ResetPasswordRequest(TOKEN, PASSWORD);
        when(authService.resetPassword(TOKEN, PASSWORD)).thenReturn(false);

        var response = victim.resetPassword(request);

        assertThat(response.getStatus(), equalTo(HttpStatus.BAD_REQUEST));
    }
}
