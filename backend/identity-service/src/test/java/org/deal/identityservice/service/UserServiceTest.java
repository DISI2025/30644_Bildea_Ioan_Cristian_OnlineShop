package org.deal.identityservice.service;

import org.deal.core.dto.UserDTO;
import org.deal.core.request.user.AssignProductCategoryRequest;
import org.deal.core.util.Mapper;
import org.deal.identityservice.entity.User;
import org.deal.identityservice.repository.UserRepository;
import org.deal.identityservice.util.BaseUnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.deal.identityservice.util.TestUtils.UserUtils.createUserRequest;
import static org.deal.identityservice.util.TestUtils.UserUtils.randomUser;
import static org.deal.identityservice.util.TestUtils.UserUtils.updateUserRequest;
import static org.deal.identityservice.util.TestUtils.randomString;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest extends BaseUnitTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private UserService victim;

    @Test
    void testFindAll_shouldReturnValidUserData() {
        var user = randomUser();
        when(userRepository.findAll()).thenReturn(List.of(user));

        var result = victim.findAll();

        verify(userRepository).findAll();
        result.ifPresentOrElse(
                usersList -> assertThat(usersList, hasItem(Mapper.mapTo(user, UserDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testFindAll_emptyData_returnsSuccess() {
        when(userRepository.findAll()).thenReturn(List.of());

        var result = victim.findAll();

        verify(userRepository).findAll();
        result.ifPresentOrElse(
                users -> assertThat(users, equalTo(List.of())),
                this::assertThatFails
        );
    }

    @Test
    void testFindById_shouldReturnValidUserData() {
        var expectedUser = randomUser();
        when(userRepository.findById(expectedUser.getId())).thenReturn(Optional.of(expectedUser));

        var result = victim.findById(expectedUser.getId());

        verify(userRepository).findById(expectedUser.getId());
        result.ifPresentOrElse(
                user -> assertThat(user, equalTo(Mapper.mapTo(expectedUser, UserDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testFindById_userNotFound_returnsEmptyOptional() {
        when(userRepository.findById(any())).thenReturn(Optional.empty());

        var result = victim.findById(UUID.randomUUID());

        verify(userRepository).findById(any());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testCreate_userIsCreated_shouldReturnCreatedUser() {
        User expectedUser = randomUser();

        User.UserBuilder builderMock = mock(User.UserBuilder.class);
        when(builderMock.withUsername(expectedUser.getUsername())).thenReturn(builderMock);
        when(builderMock.withEmail(expectedUser.getEmail())).thenReturn(builderMock);
        when(builderMock.withPassword(expectedUser.getPassword())).thenReturn(builderMock);
        when(builderMock.withRole(expectedUser.getRole())).thenReturn(builderMock);
        when(builderMock.build()).thenReturn(expectedUser);

        when(userRepository.save(expectedUser)).thenReturn(expectedUser);
        when(passwordEncoder.encode(expectedUser.getPassword())).thenReturn(expectedUser.getPassword());

        try (var mockedStatic = mockStatic(User.class)) {
            mockedStatic.when(User::builder).thenReturn(builderMock);

            var result = victim.create(createUserRequest(expectedUser));

            verify(userRepository).save(expectedUser);
            result.ifPresentOrElse(
                    user -> assertThat(user, equalTo(Mapper.mapTo(expectedUser, UserDTO.class))),
                    this::assertThatFails
            );
        }
    }

    @Test
    void testUpdate_userIsFound_shouldReturnUpdatedUser() {
        var initialUser = randomUser();
        var updatedUser = randomUser();
        updatedUser.setId(initialUser.getId());
        updatedUser.setPassword(initialUser.getPassword());
        updatedUser.setProductCategoryIds(initialUser.getProductCategoryIds());
        when(userRepository.findById(initialUser.getId())).thenReturn(Optional.of(initialUser));

        var result = victim.update(updateUserRequest(updatedUser));

        verify(userRepository).findById(initialUser.getId());
        verify(userRepository).save(initialUser);
        result.ifPresentOrElse(
                user -> assertThat(user, equalTo(Mapper.mapTo(updatedUser, UserDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testUpdate_userIsNotFound_returnsEmptyOptional() {
        when(userRepository.findById(any())).thenReturn(Optional.empty());

        var result = victim.update(updateUserRequest(randomUser()));

        verify(userRepository).findById(any());
        verify(userRepository, never()).save(any());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testAssignProductCategory_userFound_shouldUpdateAndReturnUserDTO() {
        // Arrange
        var user = randomUser();
        var categoryId = UUID.randomUUID();
        var request = new AssignProductCategoryRequest(user.getId(), List.of(categoryId));

        user.setProductCategoryIds(new ArrayList<>());

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        // Act
        var result = victim.assignProductCategory(request);

        // Assert
        verify(userRepository).findById(user.getId());
        verify(userRepository).save(user);

        result.ifPresentOrElse(
                dto -> {
                    assertEquals(user.getId(), dto.id());
                    assertTrue(dto.productCategoryIds().contains(categoryId));
                    assertEquals(1, dto.productCategoryIds().size());
                },
                this::assertThatFails
        );
    }


    @Test
    void testAssignProductCategory_userNotFound_returnsEmptyOptional() {
        // Arrange
        var request = new AssignProductCategoryRequest(UUID.randomUUID(), List.of(UUID.randomUUID()));

        when(userRepository.findById(request.userId())).thenReturn(Optional.empty());

        // Act
        var result = victim.assignProductCategory(request);

        // Assert
        verify(userRepository).findById(request.userId());
        verify(userRepository, never()).save(any());

        assertTrue(result.isEmpty());
    }


    @Test
    void testDelete_userIsFound_shouldReturnDeletedUser() {
        var user = randomUser();
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepository.deleteByIdReturning(user.getId())).thenReturn(1);

        var result = victim.deleteById(user.getId());

        verify(userRepository).findById(user.getId());
        verify(userRepository).deleteByIdReturning(user.getId());
        result.ifPresentOrElse(
                deletedUser -> assertThat(deletedUser, equalTo(Mapper.mapTo(user, UserDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testDelete_userIsNotFound_returnsEmptyOptional() {
        when(userRepository.findById(any())).thenReturn(Optional.empty());

        var result = victim.deleteById(UUID.randomUUID());

        verify(userRepository).findById(any());
        verify(userRepository, never()).deleteByIdReturning(any());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testDelete_userIsNotDeleted_returnsEmptyOptional() {
        var user = randomUser();
        when(userRepository.findById(any())).thenReturn(Optional.of(user));
        when(userRepository.deleteByIdReturning(user.getId())).thenReturn(0);

        var result = victim.deleteById(user.getId());

        verify(userRepository).findById(any());
        verify(userRepository).deleteByIdReturning(user.getId());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testLoadUserByUsername_shouldReturnValidUser() {
        var user = randomUser();
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));

        var result = victim.loadUserByUsername(user.getUsername());

        verify(userRepository).findByUsername(user.getUsername());
        assertThat(result, equalTo(user));
    }

    @Test
    void testLoadUserByUsername_userNotFound_throwsException() {
        when(userRepository.findByUsername(any())).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> victim.loadUserByUsername(any()));
    }

    @Test
    void testUpdateUserPassword_shouldReturnSuccess() {
        String newPassword = randomString();
        when(userRepository.updateUserPassword(any(), anyString())).thenReturn(1);
        when(passwordEncoder.encode(newPassword)).thenReturn(newPassword);

        boolean result = victim.updateUserPassword(UUID.randomUUID(), newPassword);

        verify(userRepository).updateUserPassword(any(), eq(newPassword));
        verify(passwordEncoder).encode(newPassword);
        assertThat(result, equalTo(true));
    }
}