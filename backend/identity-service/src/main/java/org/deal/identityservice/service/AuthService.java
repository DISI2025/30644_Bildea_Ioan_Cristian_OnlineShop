package org.deal.identityservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.exception.DealError;
import org.deal.core.exception.DealException;
import org.deal.core.request.login.LoginRequest;
import org.deal.core.response.login.LoginResponse;
import org.deal.identityservice.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public Optional<LoginResponse> authenticate(final LoginRequest loginUserRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginUserRequest.username(),
                            loginUserRequest.password()
                    )
            );
            String token = jwtTokenProvider.generateToken(auth);
            CustomUserDetails userDetails = userService.loadUserByUsername(loginUserRequest.username());
            User user = userDetails.getUser();

            return Optional.of(new LoginResponse(token, userService.mapToDTO(user)));
        } catch (BadCredentialsException ex) {
            throw new DealException(DealError.BAD_CREDENTIAL_EXCEPTION.message(), HttpStatus.BAD_REQUEST);
        }
    }
}
