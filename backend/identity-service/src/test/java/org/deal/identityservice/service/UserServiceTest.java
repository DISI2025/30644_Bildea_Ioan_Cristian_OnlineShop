package org.deal.identityservice.service;

import org.deal.core.client.DealClient;
import org.deal.core.dto.ProductCategoryDTO;
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
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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
    private DealClient dealClient;

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
    void testFindProfileById_userFound_returnsUserProfileWithCategories() throws Exception {
        var user = randomUser();
        var jwt = "Bearer test.jwt.token";
        var category = new ProductCategoryDTO(UUID.randomUUID(), "Fruits");

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(dealClient.call(
                any(),
                anyString(),
                eq(HttpMethod.POST),
                any(),
                any(),
                eq(Set.class)
        )).thenReturn(Set.of(category));

        var auth = new UsernamePasswordAuthenticationToken(user.getUsername(), jwt);
        SecurityContextHolder.getContext().setAuthentication(auth);

        var result = victim.findProfileById(user.getId());

        verify(userRepository).findById(user.getId());
        assertTrue(result.isPresent());
        var profile = result.get();
        assertThat(profile.email(), equalTo(user.getEmail()));
        assertThat(profile.productCategories(), hasItem(category));
    }

    @Test
    void testFindProfileById_userNotFound_returnsEmpty() {
        var id = UUID.randomUUID();

        when(userRepository.findById(id)).thenReturn(Optional.empty());

        var result = victim.findProfileById(id);

        verify(userRepository).findById(id);
        assertTrue(result.isEmpty());
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

        var result = victim.update(updateUserRequest(updatedUser), updatedUser.getFullName(), updatedUser.getAddress(), updatedUser.getCity(), updatedUser.getCountry(), updatedUser.getPostalCode(), updatedUser.getPhoneNumber());

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

        var result = victim.update(updateUserRequest(randomUser()), null,null, null, null, null, null);

        verify(userRepository).findById(any());
        verify(userRepository, never()).save(any());
        result.ifPresent(this::assertThatFails);
    }

    @Test
    void testUpdate_optionalParamsAreNull_shouldNotOverrideExistingFields() {
        var user = randomUser();
        var expected = user;

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        var result = victim.update(updateUserRequest(user), null,null, null, null, null, null);

        verify(userRepository).findById(user.getId());
        verify(userRepository).save(user);

        assertThat(user.getAddress(), equalTo(expected.getAddress()));
        assertThat(user.getCity(), equalTo(expected.getCity()));
        assertThat(user.getCountry(), equalTo(expected.getCountry()));
        assertThat(user.getPostalCode(), equalTo(expected.getPostalCode()));
        assertThat(user.getPhoneNumber(), equalTo(expected.getPhoneNumber()));

        result.ifPresentOrElse(
                dto -> assertThat(dto, equalTo(Mapper.mapTo(user, UserDTO.class))),
                this::assertThatFails
        );
    }

    @Test
    void testUpdate_someOptionalParamsProvided_shouldUpdateOnlyThoseFields() {
        var user = randomUser();
        var newCity = "Cluj-Napoca";
        var newPhone = "0740123456";

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        var result = victim.update(updateUserRequest(user), null,null, newCity, null, null, newPhone);

        verify(userRepository).findById(user.getId());
        verify(userRepository).save(user);

        assertThat(user.getCity(), equalTo(newCity));
        assertThat(user.getPhoneNumber(), equalTo(newPhone));
        result.ifPresentOrElse(
                dto -> assertThat(dto.city(), equalTo(newCity)),
                this::assertThatFails
        );
    }

    @Test
    void testUpdate_allOptionalParamsEmptyStrings_shouldOverrideWithEmpty() {
        var user = randomUser();

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        var result = victim.update(updateUserRequest(user), "", "", "", "", "", "");

        verify(userRepository).findById(user.getId());
        verify(userRepository).save(user);

        assertThat(user.getAddress(), equalTo(""));
        assertThat(user.getCity(), equalTo(""));
        assertThat(user.getCountry(), equalTo(""));
        assertThat(user.getPostalCode(), equalTo(""));
        assertThat(user.getPhoneNumber(), equalTo(""));

        result.ifPresentOrElse(
                dto -> assertThat(dto.address(), equalTo("")),
                this::assertThatFails
        );
    }


    @Test
    void testAssignProductCategories_userFound_shouldUpdateAndReturnUserDTO() {
        // Arrange
        var user = randomUser();
        var categoryId = UUID.randomUUID();
        var request = new AssignProductCategoryRequest(user.getId(), Set.of(categoryId));

        user.setProductCategoryIds(new HashSet<>());

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        // Act
        var result = victim.assignProductCategories(request);

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
    void testAssignProductCategories_userNotFound_returnsEmptyOptional() {
        // Arrange
        var request = new AssignProductCategoryRequest(UUID.randomUUID(), Set.of(UUID.randomUUID()));

        when(userRepository.findById(request.userId())).thenReturn(Optional.empty());

        // Act
        var result = victim.assignProductCategories(request);

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

    @Test
    void testMapToDTO_shouldReturnMappedDTO() {
        var user = randomUser();
        var expectedDTO = Mapper.mapTo(user, UserDTO.class);

        var result = victim.mapToDTO(user);

        assertThat(result, equalTo(expectedDTO));
    }

}