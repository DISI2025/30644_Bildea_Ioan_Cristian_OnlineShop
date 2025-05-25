package org.deal.productservice.security;

import lombok.Getter;
import lombok.Setter;
import org.deal.core.dto.UserDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
@Getter
@Setter
public class DealContext {
    private UserDTO user;
    private static final ThreadLocal<String> TOKEN = new ThreadLocal<>();

    public void setToken(final String tokenToBeSet) {
        TOKEN.set(tokenToBeSet);
    }

    public String getToken() {
        return TOKEN.get();
    }

    public void clear() {
        TOKEN.remove();
    }
}
