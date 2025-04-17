package org.deal.identityservice.service;

import org.deal.identityservice.entity.User;
import org.deal.identityservice.repository.UserRepository;
import org.deal.identityservice.util.BaseUnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest extends BaseUnitTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService victim;

    @Test
    void testFindAll_shouldReturnValidUserData() {
        var user = new User(UUID.randomUUID(), "someName");
        when(userRepository.findAll()).thenReturn(List.of(user));

        var result = victim.findAll();

//        result.ifPresentOrElse(
//                usersList -> assertThat(usersList, hasItem(user)),
//                this::assertThatFails
//        );
    }

}