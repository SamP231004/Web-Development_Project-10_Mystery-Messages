package com.mysterymessages.api.service;

import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.mysterymessages.api.exception.ApiException;
import com.mysterymessages.api.model.User;
import com.mysterymessages.api.repository.UserRepository;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User requireUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Authentication required to proceed");
        }
        String userId = Objects.requireNonNull(authentication.getName());
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Unable to find user"));
    }
}
