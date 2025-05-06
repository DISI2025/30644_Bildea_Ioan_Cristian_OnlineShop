package org.deal.identityservice.service;

import org.deal.core.dto.UserDTO;
import org.deal.core.exception.DealError;
import org.deal.core.exception.DealException;
import org.deal.core.request.login.LoginRequest;
import org.deal.core.response.login.LoginResponse;
import org.deal.identityservice.entity.User;
import org.deal.identityservice.util.TestUtils.LoginUtils;
import org.deal.identityservice.util.TestUtils.UserUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthService authService;

    @Test
    void authenticate_validCredentials_shouldReturnLoginResponse() {
        // Arrange
        LoginRequest loginRequest = LoginUtils.randomLoginRequest();
        String username = loginRequest.username();
        String token = "mocked-jwt-token";

        Authentication mockAuthentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mockAuthentication);
        when(jwtTokenProvider.generateToken(mockAuthentication)).thenReturn(token);

        // user with same username
        User user = UserUtils.randomUser();
        user.setUsername(username); // match loginRequest

        CustomUserDetails userDetails = new CustomUserDetails(user);
        UserDTO userDTO = UserUtils.randomUserDTO();

        when(userService.loadUserByUsername(username)).thenReturn(userDetails);
        when(userService.mapToDTO(user)).thenReturn(userDTO);

        // Act
        Optional<LoginResponse> result = authService.authenticate(loginRequest);

        // Assert
        assertThat(result)
                .isPresent()
                .get()
                .satisfies(loginResponse -> {
                    assertThat(loginResponse.accessToken()).isEqualTo(token);
                    assertThat(loginResponse.user()).isEqualTo(userDTO);
                });

        verify(authenticationManager).authenticate(any());
        verify(jwtTokenProvider).generateToken(mockAuthentication);
        verify(userService).loadUserByUsername(username);
        verify(userService).mapToDTO(user);
    }

    @Test
    void authenticate_invalidCredentials_shouldThrowDealException() {
        // Arrange
        LoginRequest loginRequest = LoginUtils.randomLoginRequest();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        assertThatThrownBy(() -> authService.authenticate(loginRequest))
                .isInstanceOf(DealException.class)
                .hasMessage(DealError.BAD_CREDENTIAL_EXCEPTION.message());

        verify(authenticationManager).authenticate(any());
        verifyNoInteractions(jwtTokenProvider, userService);
    }
}
