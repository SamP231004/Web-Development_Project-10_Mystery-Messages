package com.mysterymessages.api.service;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mysterymessages.api.dto.ApiResponse;
import com.mysterymessages.api.dto.AuthRequest;
import com.mysterymessages.api.dto.SignUpRequest;
import com.mysterymessages.api.dto.VerifyCodeRequest;
import com.mysterymessages.api.exception.ApiException;
import com.mysterymessages.api.model.User;
import com.mysterymessages.api.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final SecureRandom secureRandom = new SecureRandom();

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }

    public ApiResponse signUp(SignUpRequest request) {
        userRepository.findVerifiedByUsername(request.username())
                .ifPresent(user -> {
                    throw new ApiException(HttpStatus.BAD_REQUEST, "Sorry, that username is taken");
                });

        String verifyCode = generateVerifyCode();
        User user = userRepository.findByEmail(request.email()).orElseGet(User::new);

        if (user.getId() != null && user.isVerified()) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Looks like this email is already registered. Try logging in!");
        }

        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setVerifyCode(verifyCode);
        user.setVerifyCodeExpiry(Instant.now().plus(1, ChronoUnit.HOURS));
        user.setVerified(false);
        user.setAcceptingMessages(true);

        // Send validation email first before capturing transient states into MongoDB
        boolean emailSent = emailService.sendVerificationEmail(request.email(), request.username(), verifyCode);
        if (!emailSent) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to send verification email. Please try again.");
        }

        try {
            userRepository.save(user);
        } catch (DuplicateKeyException ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email or username is already registered");
        }

        return ApiResponse.success("Welcome aboard! Please verify your account to get started.");
    }

    public ApiResponse checkUsername(String encodedUsername) {
        if (encodedUsername == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid query parameters provided.");
        }

        String username = URLDecoder.decode(encodedUsername, StandardCharsets.UTF_8);

        if (username.length() < 2 || username.length() > 20 || !username.matches("^[a-zA-Z0-9_]+$")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid query parameters provided.");
        }

        if (userRepository.findVerifiedByUsername(username).isPresent()) {
            return ApiResponse.failure("Username is already taken");
        }
        return ApiResponse.success("Username is unique");
    }

    public ApiResponse verify(VerifyCodeRequest request) {
        String username = URLDecoder.decode(request.username(), StandardCharsets.UTF_8);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        boolean isCodeValid = request.code().equals(user.getVerifyCode());
        boolean isCodeNotExpired = user.getVerifyCodeExpiry() != null
                && user.getVerifyCodeExpiry().isAfter(Instant.now());

        if (isCodeValid && isCodeNotExpired) {
            user.setVerified(true);
            userRepository.save(user);
            return ApiResponse.success("Account verified successfully!");
        }
        if (!isCodeNotExpired) {
            throw new ApiException(HttpStatus.BAD_REQUEST,
                    "Verification code has expired. Please sign up again to get a new one.");
        }
        throw new ApiException(HttpStatus.BAD_REQUEST, "Wrong verification code, please try again");
    }

    public ApiResponse authenticate(AuthRequest request) {
        User user = userRepository.findByEmailOrUsername(request.identifier(), request.identifier())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "No user haunts this email address!"));

        if (!user.isVerified()) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Please verify your account before logging in.");
        }
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Wrong password, please try again");
        }

        ApiResponse response = ApiResponse.success("Successfully signed in");
        response.setToken(jwtService.createToken(user));
        response.setUser(user);
        return response;
    }

    private String generateVerifyCode() {
        return String.valueOf(100000 + secureRandom.nextInt(900000));
    }
}