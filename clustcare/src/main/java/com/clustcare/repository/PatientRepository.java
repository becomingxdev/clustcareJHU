package com.clustcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clustcare.model.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    long countByClinicId(Long clinicId);

    java.util.List<Patient> findByClinic_Id(Long clinicId);
}
