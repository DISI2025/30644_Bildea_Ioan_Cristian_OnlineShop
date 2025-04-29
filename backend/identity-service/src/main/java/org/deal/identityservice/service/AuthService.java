package org.deal.identityservice.service;

import org.deal.core.dto.JwtLoginResponseDTO;
import org.deal.core.request.user.LoginUserRequest;

import java.util.Optional;

public interface AuthService {
    Optional<JwtLoginResponseDTO> authenticate(LoginUserRequest loginUserRequest);
}
