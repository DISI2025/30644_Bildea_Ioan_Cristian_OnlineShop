package org.deal.identityservice.service;

import org.deal.core.exception.DealError;
import org.deal.core.exception.DealException;
import org.deal.identityservice.entity.PasswordResetToken;
import org.deal.identityservice.entity.User;
import org.deal.identityservice.repository.PasswordResetTokenRepository;
import org.deal.identityservice.repository.UserRepository;
import org.deal.identityservice.util.TestUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthService authService;

    @Test
    void handleForgotPassword_existingUser_shouldSendEmail() {
        // Arrange
        User user = TestUtils.UserUtils.randomUser();

        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));

        ReflectionTestUtils.setField(authService, "resetPasswordUrl", "http://frontend/reset-password");
        ReflectionTestUtils.setField(authService, "resetPasswordEmailTitle", "Reset Password");
        ReflectionTestUtils.setField(authService, "resetPasswordEmailBody", "Click the link: ");

        // Act
        authService.handleForgotPassword(user.getUsername());

        // Assert
        ArgumentCaptor<PasswordResetToken> tokenCaptor = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(tokenRepository).save(tokenCaptor.capture());

        PasswordResetToken capturedToken = tokenCaptor.getValue();
        String expectedToken = capturedToken.getToken();

        verify(userRepository).findByUsername(user.getUsername());
        verify(tokenRepository).deleteByUserId(user.getId());
        verify(emailService).sendEmail(
                eq(user.getUsername()),
                eq("Reset Password"),
                eq("Click the link: http://frontend/reset-password?token=" + expectedToken)
        );
    }

    @Test
    void handleForgotPassword_nonExistingUser_shouldThrow() {
        String email = "nonexistent@example.com";
        when(userRepository.findByUsername(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.handleForgotPassword(email))
                .isInstanceOf(DealException.class)
                .hasMessage(DealError.USERNAME_NOT_FOUND.message());
    }

    @Test
    void resetPassword_validToken_shouldResetPassword() {
        User user = TestUtils.UserUtils.randomUser();
        String token = UUID.randomUUID().toString();
        String newPassword = "newSecurePass123";
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(10))
                .build();

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(resetToken));
        when(userService.passwordEncoder()).thenReturn(mock(PasswordEncoder.class));
        when(userService.passwordEncoder().encode(newPassword)).thenReturn("encodedPass");

        authService.resetPassword(token, newPassword);

        verify(userRepository).save(user);
        verify(tokenRepository).delete(resetToken);
    }

    @Test
    void resetPassword_expiredToken_shouldThrow() {
        User user = TestUtils.UserUtils.randomUser();
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().minusMinutes(1))
                .build();

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(resetToken));

        assertThatThrownBy(() -> authService.resetPassword(token, "somePassword"))
                .isInstanceOf(DealException.class)
                .hasMessage(DealError.TOKEN_EXPIRED.message());
    }

    @Test
    void resetPassword_invalidToken_shouldThrow() {
        String token = "invalid-token";
        when(tokenRepository.findByToken(token)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.resetPassword(token, "somePassword"))
                .isInstanceOf(DealException.class)
                .hasMessage(DealError.INVALID_TOKEN.message());
    }
}
