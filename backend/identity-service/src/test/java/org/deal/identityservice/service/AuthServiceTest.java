package org.deal.identityservice.service;

import org.deal.core.dto.UserDTO;
import org.deal.core.request.user.CreateUserRequest;
import org.deal.core.util.Mapper;
import org.deal.identityservice.util.BaseUnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.deal.identityservice.util.TestUtils.AuthUtils.loginRequest;
import static org.deal.identityservice.util.TestUtils.UserUtils.createUserRequest;
import static org.deal.identityservice.util.TestUtils.UserUtils.randomUser;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest extends BaseUnitTest {

    private final static String TOKEN = "mockToken";

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtServiceImpl jwtService;

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthService victim;

    @Test
    void testAuthenticate_validCredentials_shouldReturnsSuccess() {
        var user = randomUser();
        var request = loginRequest(user);
        when(userService.loadUserByUsername(request.username())).thenReturn(user);
        when(jwtService.generateToken(user)).thenReturn(TOKEN);

        var result = victim.authenticate(request);

        verify(userService).loadUserByUsername(request.username());
        verify(jwtService).generateToken(user);
        verify(authenticationManager).authenticate(eq(new UsernamePasswordAuthenticationToken(request.username(), request.password())));
        result.ifPresentOrElse(
                authResponse -> {
                    assertThat(authResponse.accessToken(), equalTo(TOKEN));
                    assertThat(authResponse.user(), equalTo(Mapper.mapTo(user, UserDTO.class)));
                },
                this::assertThatFails
        );
    }

    @Test
    void testAuthenticate_userNotFound_shouldReturnEmptyOptional() {
        doThrow(new UsernameNotFoundException("")).when(userService).loadUserByUsername(any());

        var result = victim.authenticate(loginRequest(randomUser()));

        verify(authenticationManager).authenticate(any());
        verify(userService).loadUserByUsername(any());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testRegister_userIsCreated_shouldReturnSuccess() {
        var user = randomUser();
        var userDto = Mapper.mapTo(user, UserDTO.class);
        var request = createUserRequest(user);
        when(userService.create(request)).thenReturn(Optional.of(userDto));
        when(jwtService.generateToken(userDto)).thenReturn(TOKEN);

        var result = victim.register(request);

        verify(userService).create(request);
        verify(jwtService).generateToken(userDto);
        result.ifPresentOrElse(
                authResponse -> {
                    assertThat(authResponse.accessToken(), equalTo(TOKEN));
                    assertThat(authResponse.user(), equalTo(Mapper.mapTo(user, UserDTO.class)));
                },
                this::assertThatFails
        );
    }

    @Test
    void testRegister_userIsNotCreated_shouldReturnEmptyOptional() {
        when(userService.create(any())).thenReturn(Optional.empty());

        var result = victim.register(createUserRequest(randomUser()));

        verify(userService).create(any(CreateUserRequest.class));
        verify(jwtService, never()).generateToken(any(UserDTO.class));
        result.ifPresent(this::assertThatFails);
    }
}
