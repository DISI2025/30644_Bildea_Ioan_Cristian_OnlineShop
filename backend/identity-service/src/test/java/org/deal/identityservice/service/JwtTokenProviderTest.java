package org.deal.identityservice.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.deal.identityservice.entity.User;
import org.deal.identityservice.util.TestUtils.UserUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Base64;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    private final String secretKey = Base64.getEncoder().encodeToString("mocked-super-secret-key-1234567890".repeat(2).getBytes());

    @BeforeEach
    void setUp() {
        final int expirationMillis = 1000 * 60 * 60;
        jwtTokenProvider = new JwtTokenProvider(secretKey, expirationMillis);
        jwtTokenProvider.init();
    }

    @Test
    void generateToken_shouldContainExpectedClaims() {
        // Arrange
        User user = UserUtils.randomUser();
        CustomUserDetails userDetails = new CustomUserDetails(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
        );

        // Act
        String token = jwtTokenProvider.generateToken(authentication);

        // Assert (decode claims)
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();

        assertThat(claims.getSubject()).isEqualTo(user.getUsername());
        assertThat(claims.get("userId", String.class)).isEqualTo(user.getId().toString());
        assertThat(claims.get("role", String.class)).isEqualTo(user.getRole().name());
        assertThat(claims.getExpiration()).isAfter(new Date());
    }
}
