package com.fitness.userservice;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.fitness.userservice.models.User;
@Repository
public interface UserRepository extends JpaRepository <User,String> {
    Boolean existsByEmail(String email);

    Boolean existsByKeycloakId(String userId);

    User findByEmail(@NotBlank(message = "Email is Required") @Email(message = "Invalid email format") String email);
}
