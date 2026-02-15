package com.clustcare.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clustcare.model.Clinic;

public interface ClinicRepository extends JpaRepository<Clinic, Long> {
    Optional<Clinic> findByUsername(String username);
}