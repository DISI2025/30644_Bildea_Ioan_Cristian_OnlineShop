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
}
