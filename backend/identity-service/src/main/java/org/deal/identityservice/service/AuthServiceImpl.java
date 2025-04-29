package org.deal.identityservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.JwtLoginResponseDTO;
import org.deal.core.exception.DealError;
import org.deal.core.exception.DealException;
import org.deal.core.request.user.LoginUserRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    public Optional<JwtLoginResponseDTO> authenticate(LoginUserRequest loginUserRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginUserRequest.username(),
                            loginUserRequest.password()
                    )
            );
            String token = jwtTokenProvider.generateToken(auth);
            return Optional.of(new JwtLoginResponseDTO(token));
        } catch (BadCredentialsException ex) {
            throw new DealException(DealError.BAD_CREDENTIAL_EXCEPTION.message(), HttpStatus.BAD_REQUEST);
        }
    }
}
