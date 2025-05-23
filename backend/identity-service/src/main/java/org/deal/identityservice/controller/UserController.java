package org.deal.identityservice.controller;

import lombok.RequiredArgsConstructor;
import org.deal.core.dto.UserDTO;
import org.deal.core.exception.DealError;
import org.deal.core.request.user.AssignProductCategoryRequest;
import org.deal.core.request.user.CreateUserRequest;
import org.deal.core.request.user.UpdateUserRequest;
import org.deal.core.response.DealResponse;
import org.deal.core.response.user.UserProfileResponse;
import org.deal.identityservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

import static org.deal.core.util.Constants.ReturnMessages.failedToSave;
import static org.deal.core.util.Constants.ReturnMessages.notFound;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public DealResponse<List<UserDTO>> getUsers() {
        return userService.findAll()
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(UserDTO.class)),
                        HttpStatus.NOT_FOUND));
    }

    @GetMapping("/{id}")
    public DealResponse<UserDTO> getUserById(@PathVariable final UUID id) {
        return userService.findById(id)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(UserDTO.class, "id", id)),
                        NOT_FOUND));
    }

    @GetMapping("/profile/{id}")
    public DealResponse<UserProfileResponse> getUserProfileById(@PathVariable final UUID id) {
        return userService.findProfileById(id)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(UserProfileResponse.class, "id", id)),
                        NOT_FOUND));
    }

    @PostMapping
    public DealResponse<UserDTO> create(@RequestBody final CreateUserRequest request) {
        return userService.create(request)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(failedToSave(UserDTO.class)),
                        BAD_REQUEST));
    }

    @PatchMapping
    public DealResponse<UserDTO> update(
            @RequestBody final UpdateUserRequest request,
            @RequestParam(required = false) final String fullName,
            @RequestParam(required = false) final String address,
            @RequestParam(required = false) final String city,
            @RequestParam(required = false) final String country,
            @RequestParam(required = false) final String postalCode,
            @RequestParam(required = false) final String phoneNumber
    ) {

        return userService.update(request, fullName, address, city, country, postalCode, phoneNumber)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(UserDTO.class, "id", request.id())),
                        NOT_FOUND));
    }

    @PatchMapping("/user-categories")
    public DealResponse<UserDTO> updateUserCategories(@RequestBody final AssignProductCategoryRequest request) {
        return userService.assignProductCategories(request)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(UserDTO.class, "id", request.userId())),
                        HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public DealResponse<UserDTO> deleteUserById(@PathVariable final UUID id) {
        return userService.deleteById(id)
                .map(DealResponse::successResponse)
                .orElse(DealResponse.failureResponse(
                        new DealError(notFound(UserDTO.class, "id", id)),
                        NOT_FOUND));
    }
}
