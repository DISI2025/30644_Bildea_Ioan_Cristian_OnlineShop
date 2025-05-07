package org.deal.identityservice.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.deal.core.dto.UserDTO;
import org.deal.core.service.JwtService;
import org.deal.core.util.Constants.Time;
import org.deal.core.util.Role;
import org.deal.identityservice.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.UUID;

@Service
public class JwtServiceImpl implements JwtService {

    @Value("${spring.jwt.secret-key}")
    private String secretKey;

    @Value("${spring.jwt.token-expiration-days}")
    private Integer tokenExpirationDays;

    @Override
    public Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public boolean isValidToken(final String token, final UUID userId, final String username, final Role role) {
        return !isExpiredToken(token)
               && hasValidUserId(token, userId)
               && hasValidUsername(token, username)
               && hasValidRole(token, role);
    }

    public String generateToken(final UserDTO userDTO) {
        return generateToken(userDTO.id(), userDTO.username(), userDTO.role());
    }

    public String generateToken(final User user) {
        return generateToken(user.getId(), user.getUsername(), user.getRole());
    }

    public String generateToken(final UUID id, final String username, final Role role) {
        return Jwts.builder()
                .claim("userId", id)
                .claim("role", role)
                .setSubject(username)
                .setIssuedAt(Time.now())
                .setExpiration(Time.nowWithDelay(Time.DAY * tokenExpirationDays))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
