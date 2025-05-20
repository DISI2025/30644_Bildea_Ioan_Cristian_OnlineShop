package org.deal.identityservice.service;

import org.deal.core.dto.UserDTO;
import org.deal.core.request.user.CreateUserRequest;
import org.deal.core.util.Mapper;
import org.deal.identityservice.entity.PasswordToken;
import org.deal.identityservice.repository.PasswordTokenRepository;
import org.deal.identityservice.util.BaseUnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.UUID;

import static org.deal.identityservice.util.TestUtils.AuthUtils.loginRequest;
import static org.deal.identityservice.util.TestUtils.AuthUtils.randomPasswordToken;
import static org.deal.identityservice.util.TestUtils.UserUtils.createUserRequest;
import static org.deal.identityservice.util.TestUtils.UserUtils.randomUser;
import static org.deal.identityservice.util.TestUtils.UserUtils.randomUserDTO;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest extends BaseUnitTest {

    private final static String TOKEN = "mockToken";
    private final static String EMAIL = "mockEmail";
    private final static String PASSWORD = "mockPassw";

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserService userService;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordTokenRepository passwordTokenRepository;

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

    @Test
    void testForgotPassword_shouldReturnSuccess() {
        var userDTO = randomUserDTO(EMAIL);
        when(userService.findByEmail(EMAIL)).thenReturn(Optional.of(userDTO));

        boolean result = victim.forgotPassword(EMAIL);

        assertThat(result, equalTo(true));
        var tokenCaptor = ArgumentCaptor.forClass(PasswordToken.class);
        verify(userService).findByEmail(EMAIL);
        verify(passwordTokenRepository).save(tokenCaptor.capture());
        verify(emailService).sendPasswordResetEmail(eq(EMAIL), anyString());
        assertThat(tokenCaptor.getValue().getUserId(), equalTo(userDTO.id()));
    }

    @Test
    void testForgotPassword_shouldReturnFailure() {
        when(userService.findByEmail(EMAIL)).thenReturn(Optional.empty());

        boolean result = victim.forgotPassword(EMAIL);

        assertThat(result, equalTo(false));
        verify(userService).findByEmail(EMAIL);
        verify(passwordTokenRepository, never()).save(any(PasswordToken.class));
        verify(emailService, never()).sendPasswordResetEmail(eq(EMAIL), anyString());
    }

    @Test
    void testResetPassword_shouldReturnSuccess() {
        var passwordToken = randomPasswordToken();
        when(passwordTokenRepository.findByToken(passwordToken.getToken())).thenReturn(Optional.of(passwordToken));
        when(userService.updateUserPassword(eq(passwordToken.getUserId()), anyString())).thenReturn(true);

        boolean result = victim.resetPassword(passwordToken.getToken(), PASSWORD);

        assertThat(result, equalTo(true));
        verify(passwordTokenRepository).findByToken(passwordToken.getToken());
        verify(userService).updateUserPassword(passwordToken.getUserId(), PASSWORD);
        verify(passwordTokenRepository).delete(passwordToken);
    }

    @Test
    void testResetPassword_tokenNotFound_shouldReturnFailure() {
        when(passwordTokenRepository.findByToken(anyString())).thenReturn(Optional.empty());

        boolean result = victim.resetPassword(TOKEN, PASSWORD);

        assertThat(result, equalTo(false));
        verify(passwordTokenRepository).findByToken(TOKEN);
        verify(userService, never()).updateUserPassword(any(), anyString());
        verify(passwordTokenRepository, never()).delete(any());
    }

    @Test
    void testResetPassword_passwordNotUpdated_shouldReturnFailure() {
        var passwordToken = randomPasswordToken();
        when(passwordTokenRepository.findByToken(anyString())).thenReturn(Optional.of(passwordToken));
        when(userService.updateUserPassword(passwordToken.getUserId(), PASSWORD)).thenReturn(false);

        boolean result = victim.resetPassword(passwordToken.getToken(), PASSWORD);

        assertThat(result, equalTo(false));
        verify(passwordTokenRepository).findByToken(passwordToken.getToken());
        verify(userService).updateUserPassword(passwordToken.getUserId(), PASSWORD);
        verify(passwordTokenRepository, never()).delete(any());
    }

    @Test
    void testValidateToken_tokenIsValid_shouldReturnSuccess() {
        var userDto = randomUserDTO();
        when(jwtService.extractUserId(TOKEN)).thenReturn(Optional.of(userDto.id()));
        when(userService.findById(userDto.id())).thenReturn(Optional.of(userDto));
        when(jwtService.isValidToken(TOKEN, userDto.id(), userDto.username(), userDto.role())).thenReturn(true);

        var result = victim.validateToken(TOKEN);

        verify(jwtService).extractUserId(TOKEN);
        verify(userService).findById(userDto.id());
        verify(jwtService).isValidToken(TOKEN, userDto.id(), userDto.username(), userDto.role());
        result.ifPresentOrElse(
                validatedUser -> assertThat(validatedUser, equalTo(userDto)),
                this::assertThatFails
        );
    }

    @Test
    void testValidateToken_malformedToken_shouldReturnFailure() {
        when(jwtService.extractUserId(TOKEN)).thenReturn(Optional.empty());

        var result = victim.validateToken(TOKEN);

        verify(jwtService).extractUserId(TOKEN);
        verify(userService, never()).findById(any());
        verify(jwtService, never()).isValidToken(eq(TOKEN), any(), anyString(), any());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testValidateToken_userNotFound_shouldReturnFailure() {
        var id = UUID.randomUUID();
        when(jwtService.extractUserId(TOKEN)).thenReturn(Optional.of(id));
        when(userService.findById(id)).thenReturn(Optional.empty());

        var result = victim.validateToken(TOKEN);

        verify(jwtService).extractUserId(TOKEN);
        verify(userService).findById(id);
        verify(jwtService, never()).isValidToken(eq(TOKEN), any(), anyString(), any());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testValidateToken_invalidToken_shouldReturnFailure() {
        var userDto = randomUserDTO();
        when(jwtService.extractUserId(TOKEN)).thenReturn(Optional.of(userDto.id()));
        when(userService.findById(userDto.id())).thenReturn(Optional.of(userDto));
        when(jwtService.isValidToken(TOKEN, userDto.id(), userDto.username(), userDto.role())).thenReturn(false);

        var result = victim.validateToken(TOKEN);

        verify(jwtService).extractUserId(TOKEN);
        verify(userService).findById(userDto.id());
        verify(jwtService).isValidToken(TOKEN, userDto.id(), userDto.username(), userDto.role());
        result.ifPresent(this::assertThatFails);
    }
}
