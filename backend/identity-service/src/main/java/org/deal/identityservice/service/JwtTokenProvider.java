package org.deal.identityservice.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    private final String secretKey;
    private final Integer tokenExpirationDays;
    private Key key;

    public JwtTokenProvider(
            final @Value("${spring.jwt.secret-key}") String secretKey,
            final @Value("${spring.jwt.token-expiration-days}") Integer tokenExpirationDays
    ) {
        this.tokenExpirationDays = tokenExpirationDays;
        this.secretKey = secretKey;
    }

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(final Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + tokenExpirationDays);

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("userId", userDetails.getId().toString())
                .claim("role", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .findFirst()
                        .orElse("ROLE_UNDEFINED"))
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

}