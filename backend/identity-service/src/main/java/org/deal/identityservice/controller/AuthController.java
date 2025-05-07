package org.deal.identityservice.controller;

import lombok.RequiredArgsConstructor;
import org.deal.core.request.auth.LoginRequest;
import org.deal.core.request.user.CreateUserRequest;
import org.deal.core.response.DealResponse;
import org.deal.core.response.login.AuthResponse;
import org.deal.identityservice.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.deal.core.exception.DealError.BAD_CREDENTIAL_EXCEPTION;
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
}
