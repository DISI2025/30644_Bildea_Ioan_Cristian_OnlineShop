package org.deal.identityservice.controller;

import lombok.RequiredArgsConstructor;
import org.deal.core.request.auth.LoginRequest;
import org.deal.core.request.password.ForgotPasswordRequest;
import org.deal.core.request.password.ResetPasswordRequest;
import org.deal.core.request.user.CreateUserRequest;
import org.deal.core.response.DealResponse;
import org.deal.core.response.auth.AuthResponse;
import org.deal.identityservice.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.deal.core.exception.DealError.BAD_CREDENTIAL_EXCEPTION;
import static org.deal.core.exception.DealError.PASSWORD_RESET_FAIL;
import static org.deal.core.exception.DealError.REGISTRATION_FAILED;
import static org.springframework.http.HttpStatus.BAD_REQUEST;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public DealResponse<AuthResponse> login(final @RequestBody LoginRequest loginRequest) {
        return authService.authenticate(loginRequest)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(BAD_CREDENTIAL_EXCEPTION, HttpStatus.UNAUTHORIZED));
    }

    @PostMapping("/register")
    public DealResponse<AuthResponse> register(@RequestBody final CreateUserRequest createUserRequest) {
        return authService.register(createUserRequest)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(REGISTRATION_FAILED, BAD_REQUEST));
    }

    @PostMapping("/forgot-password")
    public DealResponse<?> forgotPassword(@RequestBody final ForgotPasswordRequest request) {
        return authService.forgotPassword(request.email()) ?
               DealResponse.successResponse(null) :
               DealResponse.failureResponse(PASSWORD_RESET_FAIL, BAD_REQUEST);
    }

    @PostMapping("/reset-password")
    public DealResponse<?> resetPassword(@RequestBody final ResetPasswordRequest request) {
        return authService.resetPassword(request.token(), request.newPassword()) ?
               DealResponse.successResponse(null) :
               DealResponse.failureResponse(PASSWORD_RESET_FAIL, BAD_REQUEST);
    }
}
