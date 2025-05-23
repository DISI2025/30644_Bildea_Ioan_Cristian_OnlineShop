package org.deal.notificationservice.security;

import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.deal.core.exception.DealException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Objects;

@Aspect
@Component
@RequiredArgsConstructor
public class RoleAuthAspect {

    private final DealContext dealContext;

    @Before("@annotation(requireRoles)")
    public void checkRoles(final RequireRoles requireRoles) {
        var principal = dealContext.getUser();

        if (Objects.isNull(principal)) {
            throw new DealException("User is not logged in", HttpStatus.UNAUTHORIZED);
        }

        boolean hasAccess = Arrays.stream(requireRoles.value())
                .anyMatch(required -> required == principal.role());

        if (!hasAccess) {
            throw new DealException("Access is forbidden", HttpStatus.FORBIDDEN);
        }
    }
}
