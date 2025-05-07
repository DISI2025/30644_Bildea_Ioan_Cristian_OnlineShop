package org.deal.identityservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.UserDTO;
import org.deal.core.request.auth.LoginRequest;
import org.deal.core.request.user.CreateUserRequest;
import org.deal.core.response.login.AuthResponse;
import org.deal.core.util.Mapper;
import org.deal.identityservice.config.JwtServiceImpl;
import org.deal.identityservice.entity.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtServiceImpl jwtService;
    private final UserService userService;

    public AuthResponse authenticate(final LoginRequest loginUserRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginUserRequest.username(), loginUserRequest.password()));

        User user = userService.loadUserByUsername(loginUserRequest.username());
        return AuthResponse.builder()
                .withUser(Mapper.mapTo(user, UserDTO.class))
                .withAccessToken(jwtService.generateToken(user))
                .build();
    }

    public Optional<AuthResponse> register(final CreateUserRequest createUserRequest) {
        return userService.create(createUserRequest)
                .map(userDTO -> AuthResponse.builder()
                        .withUser(Mapper.mapTo(userDTO, UserDTO.class))
                        .withAccessToken(jwtService.generateToken(userDTO))
                        .build());
    }
}
