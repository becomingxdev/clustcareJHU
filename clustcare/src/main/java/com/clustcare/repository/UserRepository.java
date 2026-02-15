package com.clustcare.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clustcare.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
}