package org.deal.identityservice.service;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.UserDTO;
import org.deal.core.request.user.AssignProductCategoryRequest;
import org.deal.core.request.user.CreateUserRequest;
import org.deal.core.request.user.UpdateUserRequest;
import org.deal.core.util.Mapper;
import org.deal.identityservice.entity.User;
import org.deal.identityservice.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
                        .withEmail(request.email())
                        .withPassword(passwordEncoder.encode(request.password()))
                        .withRole(request.role())
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

    public Optional<UserDTO> assignProductCategories(final AssignProductCategoryRequest request) {
        return userRepository.findById(request.userId())
                .map(user -> {
                    List<UUID> existingIds = Optional.ofNullable(user.getProductCategoryIds())
                            .orElse(new ArrayList<>());

                    Set<UUID> merged = new HashSet<>(existingIds);
                    merged.addAll(request.productCategoryIds());

                    user.setProductCategoryIds(new ArrayList<>(merged));
                    userRepository.save(user);

                    return mapToDTO(user);
                });
    }

    public Optional<UserDTO> deleteById(final UUID id) {
        return userRepository.findById(id)
                .filter(__ -> userRepository.deleteByIdReturning(id) != 0)
                .map(this::mapToDTO);
    }

    @Override
    public User loadUserByUsername(final String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public Optional<UserDTO> findByEmail(final String email) {
        return userRepository.findByEmail(email).map(this::mapToDTO);
    }

    public boolean updateUserPassword(final UUID id, final String newPassword) {
        return userRepository.updateUserPassword(id, passwordEncoder.encode(newPassword)) != 0;
    }

    public UserDTO mapToDTO(final User user) {
        return Mapper.mapTo(user, UserDTO.class);
    }
}
