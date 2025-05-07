package org.deal.identityservice.controller;

import lombok.RequiredArgsConstructor;
import org.deal.core.exception.DealError;
import org.deal.core.request.login.LoginRequest;
import org.deal.core.response.DealResponse;
import org.deal.core.response.login.LoginResponse;
import org.deal.identityservice.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public DealResponse<LoginResponse> login(final @RequestBody LoginRequest loginRequest) {
        return authService.authenticate(loginRequest)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(DealError.BAD_CREDENTIAL_EXCEPTION.message()), HttpStatus.BAD_REQUEST));
    }
}
