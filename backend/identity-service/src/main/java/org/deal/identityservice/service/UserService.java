package org.deal.identityservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.UserDTO;
import org.deal.core.request.user.CreateUserRequest;
import org.deal.core.request.user.UpdateUserRequest;
import org.deal.core.util.Mapper;
import org.deal.identityservice.entity.User;
import org.deal.identityservice.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public Optional<List<UserDTO>> findAll() {
        return Optional.of(userRepository.findAll().stream().map(this::mapToDTO).toList());
    }

    public Optional<UserDTO> findById(final UUID id) {
        return userRepository.findById(id).map(this::mapToDTO);
    }

    public Optional<UserDTO> create(final CreateUserRequest request) {
        var user = userRepository.save(
                User.builder()
                        .withUsername(request.username())
                        .build()
        );

        return Optional.of(mapToDTO(user));
    }

    public Optional<UserDTO> update(final UpdateUserRequest request) {
        return userRepository.findById(request.id())
                .map(user -> {
                    Mapper.updateValues(user, request);
                    userRepository.save(user);

                    return mapToDTO(user);
                });
    }

    public Optional<UserDTO> deleteById(final UUID id) {
        return userRepository.findById(id)
                .filter(__ -> userRepository.deleteByIdReturning(id) != 0)
                .map(this::mapToDTO);
    }

    private UserDTO mapToDTO(final User user) {
        return Mapper.mapTo(user, UserDTO.class);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
