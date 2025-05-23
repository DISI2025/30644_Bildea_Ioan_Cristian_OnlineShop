package org.deal.identityservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.deal.core.dto.UserDTO;
import org.deal.core.request.auth.LoginRequest;
import org.deal.core.request.user.CreateUserRequest;
import org.deal.core.response.auth.AuthResponse;
import org.deal.core.util.Mapper;
import org.deal.identityservice.entity.PasswordToken;
import org.deal.identityservice.entity.User;
import org.deal.identityservice.repository.PasswordTokenRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final EmailService emailService;
    private final PasswordTokenRepository passwordTokenRepository;

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

    public boolean forgotPassword(final String email) {
        return userService.findByEmail(email)
                .map(userDTO -> {
                    PasswordToken passwordToken = PasswordToken.builder()
                            .withUserId(userDTO.id())
                            .withToken(UUID.randomUUID().toString())
                            .withExpiryDate(LocalDateTime.now().plusMinutes(15))
                            .build();
                    passwordTokenRepository.save(passwordToken);
                    emailService.sendPasswordResetEmail(email, passwordToken.getToken());
                    return true;
                })
                .orElse(false);
    }

    public boolean resetPassword(final String token, final String newPassword) {
        return passwordTokenRepository.findByToken(token)
                .map(foundToken -> {
                    if (userService.updateUserPassword(foundToken.getUserId(), newPassword)) {
                        passwordTokenRepository.delete(foundToken);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }

    public Optional<UserDTO> validateToken(final String token) {
        return jwtService.extractUserId(token)
                .flatMap(userService::findById)
                .filter(userDto -> jwtService.isValidToken(token, userDto.id(), userDto.username(), userDto.role()));
    }
}
