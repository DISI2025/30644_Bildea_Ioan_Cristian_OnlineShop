package org.deal.identityservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.exception.DealError;
import org.deal.core.exception.DealException;
import org.deal.identityservice.entity.PasswordResetToken;
import org.deal.identityservice.entity.User;
import org.deal.identityservice.repository.PasswordResetTokenRepository;
import org.deal.identityservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordResetTokenRepository tokenRepository;

    private final EmailService emailService;

    private final UserService userService;

    @Value("${app.frontend.reset-password-url}")
    private String resetPasswordUrl;

    @Value("${app.frontend.reset-password-email-title}")
    private String resetPasswordEmailTitle;

    @Value("${app.frontend.reset-password-email-body}")
    private String resetPasswordEmailBody;


    public void sendResetLink(final User user, final String token) {
        String resetLink = resetPasswordUrl + "?token=" + token;
        emailService.sendEmail(
                user.getUsername(),
                resetPasswordEmailTitle,
                resetPasswordEmailBody + resetLink
        );
    }

    public void handleForgotPassword(final String email) {
        User user = userRepository.findByUsername(email)
                .orElseThrow(() -> new DealException(DealError.USERNAME_NOT_FOUND.message(), HttpStatus.NOT_FOUND));

        String token = UUID.randomUUID().toString();

        tokenRepository.deleteByUserId(user.getId());

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();

        tokenRepository.save(resetToken);

        sendResetLink(user, token);
    }

    public void resetPassword(final String token, final String newPassword) {
        final PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new DealException(DealError.INVALID_TOKEN.message(), HttpStatus.BAD_REQUEST));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new DealException(DealError.TOKEN_EXPIRED.message(), HttpStatus.BAD_REQUEST);
        }

        User user = resetToken.getUser();
        user.setPassword(userService.passwordEncoder().encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken);
    }

}