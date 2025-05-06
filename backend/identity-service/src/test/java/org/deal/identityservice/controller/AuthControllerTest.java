package org.deal.identityservice.controller;

import org.deal.core.exception.DealError;
import org.deal.core.exception.DealException;
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

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest extends BaseUnitTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController victim;

    @InjectMocks
    private AuthController controller;

    @Test
    void testForgotPassword_validEmail_shouldReturnSuccess() {
        var request = TestUtils.ForgotPasswordUtils.randomForgotPasswordRequest();

        var response = controller.forgotPassword(request);

        verify(authService).handleForgotPassword(request.username());
        TestUtils.ResponseUtils.assertThatResponseIsSuccessful(response, "Reset link sent if email exists.");
    }

    @Test
    void testForgotPassword_invalidEmail_shouldReturnFailure() {
        var request = TestUtils.ForgotPasswordUtils.randomForgotPasswordRequest();
        doThrow(new DealException(DealError.USERNAME_NOT_FOUND.message(), HttpStatus.BAD_REQUEST))
                .when(authService).handleForgotPassword(request.username());

        var response = controller.forgotPassword(request);

        verify(authService).handleForgotPassword(request.username());
        TestUtils.ResponseUtils.assertThatResponseFailed(
                response,
                List.of(DealError.USERNAME_NOT_FOUND),
                HttpStatus.BAD_REQUEST
        );
    }

    @Test
    void testResetPassword_validToken_shouldReturnSuccess() {
        var request = TestUtils.ForgotPasswordUtils.randomResetPasswordRequest(TestUtils.UserUtils.randomUser());

        var response = controller.resetPassword(request);

        verify(authService).resetPassword(request.token(), request.newPassword());
        TestUtils.ResponseUtils.assertThatResponseIsSuccessful(response, "Password reset successfully.");
    }

    @Test
    void testResetPassword_invalidToken_shouldReturnFailure() {
        var request = TestUtils.ForgotPasswordUtils.randomResetPasswordRequest(TestUtils.UserUtils.randomUser());
        doThrow(new DealException(DealError.TOKEN_EXPIRED.message(), HttpStatus.BAD_REQUEST))
                .when(authService).resetPassword(request.token(), request.newPassword());

        var response = controller.resetPassword(request);

        verify(authService).resetPassword(request.token(), request.newPassword());
        TestUtils.ResponseUtils.assertThatResponseFailed(
                response,
                List.of(DealError.TOKEN_EXPIRED),
                HttpStatus.BAD_REQUEST
        );
    }

}
