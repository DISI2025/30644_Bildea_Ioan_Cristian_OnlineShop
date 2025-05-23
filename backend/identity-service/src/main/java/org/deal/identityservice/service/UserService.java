package org.deal.identityservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.Headers;
import org.deal.core.client.DealClient;
import org.deal.core.client.DealService;
import org.deal.core.dto.ProductCategoryDTO;
import org.deal.core.dto.UserDTO;
import org.deal.core.exception.DealException;
import org.deal.core.request.productcategory.GetProductCategoriesRequest;
import org.deal.core.request.user.AssignProductCategoryRequest;
import org.deal.core.request.user.CreateUserRequest;
import org.deal.core.request.user.UpdateUserRequest;
import org.deal.core.response.user.UserProfileResponse;
import org.deal.core.util.Mapper;
import org.deal.identityservice.entity.User;
import org.deal.identityservice.repository.UserRepository;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DealClient dealClient;

    public Optional<List<UserDTO>> findAll() {
        return Optional.of(userRepository.findAll().stream().map(this::mapToDTO).toList());
    }

    public Optional<UserDTO> findById(final UUID id) {
        return userRepository.findById(id).map(this::mapToDTO);
    }

    public Optional<UserProfileResponse> findProfileById(final UUID id) {
        Optional<UserDTO> userDTO = userRepository.findById(id).map(this::mapToDTO);
        if(userDTO.isEmpty()) {
            return Optional.empty();
        }

        String jwtToken = extractJwtFromContext();

        try {
            Set<UUID> categoryIds = userDTO.get().productCategoryIds();
            Set<ProductCategoryDTO> productCategories = null;

            if (categoryIds != null && !categoryIds.isEmpty()) {
                GetProductCategoriesRequest requestBody = new GetProductCategoriesRequest(categoryIds);

                Headers headers = new Headers.Builder()
                        .add("Authorization", "Bearer " + jwtToken)
                        .add("Content-Type", "application/json")
                        .build();

                Set<?> rawSet = dealClient.call(
                        DealService.PS,
                        "/product-categories/by-ids",
                        HttpMethod.POST,
                        requestBody,
                        headers,
                        Set.class
                );

                productCategories = rawSet.stream()
                        .map(item -> Mapper.mapTo(item, ProductCategoryDTO.class))
                        .collect(Collectors.toSet());
            }

            UserDTO user = userDTO.get();
            UserProfileResponse userProfileResponse = UserProfileResponse.builder()
                    .withId(user.id())
                    .withEmail(user.email())
                    .withUsername(user.username())
                    .withRole(user.role())
                    .withCreatedAt(user.createdAt())
                    .withProductCategories(productCategories)
                    .withFullName(user.fullName())
                    .withAddress(user.address())
                    .withCity(user.city())
                    .withCountry(user.country())
                    .withPhoneNumber(user.phoneNumber())
                    .withPostalCode(user.postalCode())
                    .withProfileUrl(user.profileUrl())
                    .withStoreAddress(user.storeAddress())
                    .build();

            return Optional.of(userProfileResponse);

        } catch (DealException e) {
            return Optional.empty();
        }
    }

    private String extractJwtFromContext() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof UsernamePasswordAuthenticationToken token) {
            Object credentials = token.getCredentials();
            if (credentials instanceof String jwt) {
                return jwt;
            }
        }
        return null;
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

    public Optional<UserDTO> update(final UpdateUserRequest request, final String fullName, final String address, final String city, final String country, final String postalCode, final String phoneNumber, final String profileUrl, final String storeAddress) {
        return userRepository.findById(request.id())
                .map(user -> {
                    Mapper.updateValues(user, request);

                    if (fullName != null) user.setFullName(fullName);
                    if (address != null) user.setAddress(address);
                    if (city != null) user.setCity(city);
                    if (country != null) user.setCountry(country);
                    if (postalCode != null) user.setPostalCode(postalCode);
                    if (phoneNumber != null) user.setPhoneNumber(phoneNumber);
                    if (profileUrl != null) user.setProfileUrl(profileUrl);
                    if (storeAddress != null) user.setStoreAddress(storeAddress);

                    userRepository.save(user);

                    return mapToDTO(user);
                });
    }

    public Optional<UserDTO> assignProductCategories(final AssignProductCategoryRequest request) {
        return userRepository.findById(request.userId())
                .map(user -> {
                    Set<UUID> newCategoryIds = new HashSet<>(request.productCategoryIds());
                    user.setProductCategoryIds(newCategoryIds);

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
