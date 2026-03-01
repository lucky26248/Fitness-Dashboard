package com.fitness.userservice.services;

import com.fitness.userservice.UserRepository;
import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.models.User;
import jdk.jshell.spi.ExecutionControl;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository repository;
    public UserResponse register(RegisterRequest request) {
        if(repository.existsByEmail(request.getEmail())){
            User existingUser =repository.findByEmail(request.getEmail());
            UserResponse userResponse = new UserResponse();
            userResponse.setEmail(existingUser.getEmail());
            userResponse.setFirstName(existingUser.getFirstName());
            userResponse.setLastName(existingUser.getLastName());
            userResponse.setPassword(existingUser.getPassword());
            userResponse.setId(existingUser.getId());
            userResponse.setCreatedAt(existingUser.getCreatedAt());
            userResponse.setUpdatedAt(existingUser.getUpdatedAt());

            return userResponse;
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setKeycloakId(request.getKeycloakId());
        user.setLastName(request.getLastName());
        user.setPassword(request.getPassword());

        User saveUser =repository.save(user);
        UserResponse userResponse = new UserResponse();
        userResponse.setEmail(saveUser.getEmail());
        userResponse.setFirstName(saveUser.getFirstName());
        userResponse.setKeycloakId(saveUser.getKeycloakId());
        userResponse.setLastName(saveUser.getLastName());
        userResponse.setPassword(saveUser.getPassword());
        userResponse.setId(saveUser.getId());
        userResponse.setCreatedAt(saveUser.getCreatedAt());
        userResponse.setUpdatedAt(saveUser.getUpdatedAt());

        return userResponse;
    }

    public UserResponse getUserProfile(String userId) {
        User user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponse userResponse = new UserResponse();
        userResponse.setEmail( user.getEmail());
        userResponse.setFirstName( user.getFirstName());
        userResponse.setLastName( user.getLastName());
        userResponse.setPassword( user.getPassword());
        userResponse.setId( user.getId());
        userResponse.setCreatedAt( user.getCreatedAt());
        userResponse.setUpdatedAt( user.getUpdatedAt());

        return userResponse;
    }

    public Boolean existByUserId(String userId) {
        log.info("Calling User Service for {}", userId);
        return repository.existsByKeycloakId(userId);
    }
}
