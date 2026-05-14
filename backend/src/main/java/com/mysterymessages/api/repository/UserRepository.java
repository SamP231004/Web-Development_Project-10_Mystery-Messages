package com.mysterymessages.api.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.mysterymessages.api.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("{ 'username': ?0, 'isVerified': true }")
    Optional<User> findVerifiedByUsername(String username);

    Optional<User> findByEmailOrUsername(String email, String username);
}
