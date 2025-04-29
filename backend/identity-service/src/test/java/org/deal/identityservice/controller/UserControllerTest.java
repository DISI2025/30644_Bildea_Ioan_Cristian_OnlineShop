package org.deal.identityservice.controller;

import org.deal.core.dto.UserDTO;
import org.deal.core.exception.DealError;
import org.deal.identityservice.service.UserService;
import org.deal.identityservice.util.BaseUnitTest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

import static org.deal.core.util.Constants.ReturnMessages.notFound;
import static org.deal.identityservice.util.TestUtils.ResponseUtils.assertThatResponseFailed;
import static org.deal.identityservice.util.TestUtils.ResponseUtils.assertThatResponseIsSuccessful;
import static org.deal.identityservice.util.TestUtils.UserUtils.randomUser;
import static org.deal.identityservice.util.TestUtils.convertAll;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserControllerTest extends BaseUnitTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController victim;

    @Test
    void testGetUser_shouldReturnSuccess() {
        var expectedUsers = List.of(randomUser(), randomUser());
        when(userService.findAll()).thenReturn(Optional.of(convertAll(expectedUsers, UserDTO.class)));

        var response = victim.getUsers();

        verify(userService).findAll();
        assertThatResponseIsSuccessful(response, convertAll(expectedUsers, UserDTO.class));
    }

    @Test
    void testGetUser_noUsersFound_returnsFailure() {
        when(userService.findAll()).thenReturn(Optional.empty());

        var response = victim.getUsers();

        verify(userService).findAll();
        assertThatResponseFailed(response, List.of(new DealError(notFound(UserDTO.class))), HttpStatus.NOT_FOUND);
    }
}