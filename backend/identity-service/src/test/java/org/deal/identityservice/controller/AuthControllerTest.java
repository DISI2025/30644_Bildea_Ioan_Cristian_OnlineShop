package org.deal.identityservice.controller;

import org.deal.core.exception.DealError;
import org.deal.identityservice.service.AuthService;
import org.deal.identityservice.util.BaseUnitTest;
import org.deal.identityservice.util.TestUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

import static org.deal.identityservice.util.TestUtils.ResponseUtils.assertThatResponseFailed;
import static org.deal.identityservice.util.TestUtils.ResponseUtils.assertThatResponseIsSuccessful;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest extends BaseUnitTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController victim;

    @Test
    void testLogin_validCredentials_returnsSuccess() {
        var loginRequest = TestUtils.LoginUtils.randomLoginRequest();
        var loginResponse = TestUtils.LoginUtils.randomLoginResponse();

        when(authService.authenticate(loginRequest)).thenReturn(Optional.of(loginResponse));

        var response = victim.login(loginRequest);

        verify(authService).authenticate(loginRequest);
        assertThatResponseIsSuccessful(response, loginResponse);
    }

    @Test
    void testLogin_invalidCredentials_returnsFailure() {
        var loginRequest = TestUtils.LoginUtils.randomLoginRequest();

        when(authService.authenticate(loginRequest)).thenReturn(Optional.empty());

        var response = victim.login(loginRequest);

        verify(authService).authenticate(loginRequest);
        assertThatResponseFailed(
                response,
                List.of(new DealError(DealError.BAD_CREDENTIAL_EXCEPTION.message())),
                HttpStatus.BAD_REQUEST
        );
    }
}
