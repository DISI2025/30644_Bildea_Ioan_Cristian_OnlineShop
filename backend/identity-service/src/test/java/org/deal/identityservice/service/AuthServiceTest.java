package org.deal.identityservice.service;

import org.deal.core.exception.DealError;
import org.deal.core.exception.DealException;
import org.deal.core.request.auth.LoginRequest;
import org.deal.identityservice.util.TestUtils.LoginUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

//    @Mock
//    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthService authService;

    // TODO:
//    @Test
//    void authenticate_validCredentials_shouldReturnLoginResponse() {
//        // Arrange
//        LoginRequest loginRequest = LoginUtils.randomLoginRequest();
//        String username = loginRequest.username();
//        String token = "mocked-jwt-token";
//
//        Authentication mockAuthentication = mock(Authentication.class);
//        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
//                .thenReturn(mockAuthentication);
//        when(jwtTokenProvider.generateToken(mockAuthentication)).thenReturn(token);
//
//        // user with same username
//        User user = UserUtils.randomUser();
//        user.setUsername(username); // match loginRequest
//
//        CustomUserDetails userDetails = new CustomUserDetails(user);
//        UserDTO userDTO = UserUtils.randomUserDTO();
//
//        when(userService.loadUserByUsername(username)).thenReturn(userDetails);
//        when(userService.mapToDTO(user)).thenReturn(userDTO);
//
//        // Act
//        Optional<AuthResponse> result = authService.authenticate(loginRequest);
//
//        // Assert
//        assertThat(result)
//                .isPresent()
//                .get()
//                .satisfies(authResponse -> {
//                    assertThat(authResponse.accessToken()).isEqualTo(token);
//                    assertThat(authResponse.user()).isEqualTo(userDTO);
//                });
//
//        verify(authenticationManager).authenticate(any());
//        verify(jwtTokenProvider).generateToken(mockAuthentication);
//        verify(userService).loadUserByUsername(username);
//        verify(userService).mapToDTO(user);
//    }

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
//        verifyNoInteractions(jwtTokenProvider, userService);
    }
}
