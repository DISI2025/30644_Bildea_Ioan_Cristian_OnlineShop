package org.deal.core.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.deal.core.util.Constants.Time;
import org.deal.core.util.Role;

import java.security.Key;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;


public interface JwtService {
    Key getSigningKey();

    boolean isValidToken(final String token, final UUID userId, final String username, final Role role);

    default Optional<Claims> extractAllClaims(final String token) {
        try {
            return Optional.of(
                    Jwts.parserBuilder()
                            .setSigningKey(getSigningKey())
                            .build()
                            .parseClaimsJws(token)
                            .getBody());
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    default <T> Optional<T> extractClaim(final String token, final Function<Claims, T> claimsResolver) {
        return extractAllClaims(token).map(claimsResolver);
    }

    default Optional<UUID> extractUserId(final String token) {
        return extractClaim(token, claims -> claims.get("userId", String.class)).map(UUID::fromString);
    }

    default Optional<String> extractUsername(final String token) {
        return extractClaim(token, Claims::getSubject);
    }

    default Optional<Role> extractRole(final String token) {
        return extractClaim(token, claims -> claims.get("role", String.class)).map(Role::valueOf);
    }

    default Optional<Date> extractExpiration(final String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    default boolean isExpiredToken(final String token) {
        return extractExpiration(token)
                .map(date -> date.before(Time.now()))
                .orElse(false);
    }

    default boolean hasValidUserId(final String token, final UUID userId) {
        return extractUserId(token)
                .map(e -> e.equals(userId))
                .orElse(false);
    }

    default boolean hasValidUsername(final String token, final String username) {
        return extractUsername(token)
                .map(e -> e.equals(username))
                .orElse(false);
    }

    default boolean hasValidRole(final String token, final Role role) {
        return extractRole(token)
                .map(e -> e.equals(role))
                .orElse(false);
    }
}
