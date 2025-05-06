package org.deal.identityservice.controller;

import lombok.RequiredArgsConstructor;
import org.deal.core.exception.DealError;
import org.deal.core.exception.DealException;
import org.deal.core.request.user.forgotpassword.ForgotPasswordRequest;
import org.deal.core.request.user.forgotpassword.ResetPasswordRequest;
import org.deal.core.response.DealResponse;
import org.deal.identityservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/forgot-password")
    public DealResponse<String> forgotPassword(final @RequestBody ForgotPasswordRequest request) {
        try {
            authService.handleForgotPassword(request.username());
            return DealResponse.successResponse("Reset link sent if email exists.");
        } catch (DealException e) {
            return DealResponse.failureResponse(new DealError(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/reset-password")
    public DealResponse<String> resetPassword(final @RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.token(), request.newPassword());
            return DealResponse.successResponse("Password reset successfully.");
        } catch (DealException e) {
            return DealResponse.failureResponse(new DealError(e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }
}
