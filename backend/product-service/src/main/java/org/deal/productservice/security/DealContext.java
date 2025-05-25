package org.deal.productservice.security;

import lombok.Getter;
import lombok.Setter;
import org.deal.core.dto.UserDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;
import org.deal.productservice.config.AppConfig.TokenStorage;

@Getter
@Setter
@Component
@RequestScope
public class DealContext {
    private final TokenStorage tokenStorage;

    private UserDTO user;
    private static final ThreadLocal<String> TOKEN = new ThreadLocal<>();

    public DealContext(final TokenStorage tokenStorage) {
        this.tokenStorage = tokenStorage;
    }

    public void setToken(final String tokenToBeSet) {
        TOKEN.set(tokenToBeSet);
        tokenStorage.setToken(tokenToBeSet);
    }

    public String getToken() {
        return TOKEN.get();
    }

    public void clear() {
        TOKEN.remove();
    }
}
