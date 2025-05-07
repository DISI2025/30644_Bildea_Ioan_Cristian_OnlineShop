package org.deal.identityservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.deal.core.dto.UserDTO;
import org.deal.core.request.auth.LoginRequest;
import org.deal.core.request.user.CreateUserRequest;
import org.deal.core.response.login.AuthResponse;
import org.deal.core.util.Mapper;
import org.deal.identityservice.entity.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtServiceImpl jwtService;
    private final UserService userService;

    public Optional<AuthResponse> authenticate(final LoginRequest loginUserRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginUserRequest.username(), loginUserRequest.password()));

        try {
            User user = userService.loadUserByUsername(loginUserRequest.username());
            return Optional.of(
                    AuthResponse.builder()
                            .withUser(Mapper.mapTo(user, UserDTO.class))
                            .withAccessToken(jwtService.generateToken(user))
                            .build());
        } catch (UsernameNotFoundException e) {
            log.error("Username {} not found: ", loginUserRequest.username(), e);
            return Optional.empty();
        }
    }

    public Optional<AuthResponse> register(final CreateUserRequest createUserRequest) {
        return userService.create(createUserRequest)
                .map(userDTO -> AuthResponse.builder()
                        .withUser(Mapper.mapTo(userDTO, UserDTO.class))
                        .withAccessToken(jwtService.generateToken(userDTO))
                        .build());
    }
}
