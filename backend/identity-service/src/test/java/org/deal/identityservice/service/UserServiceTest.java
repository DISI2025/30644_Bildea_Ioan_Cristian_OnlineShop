package org.deal.identityservice.service;

import org.deal.core.dto.UserDTO;
import org.deal.core.util.Mapper;
import org.deal.identityservice.repository.UserRepository;
import org.deal.identityservice.util.BaseUnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.deal.identityservice.util.TestUtils.UserUtils.randomUser;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest extends BaseUnitTest {

    @Mock
    private UserRepository userRepository;

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

    // TODO: each method should be tested for success and failure and/or sets of data (e.g. data, no data, error/exception)
}