package com.clustcare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clustcare.model.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    long countByClinicIdAndActiveTrue(Long clinicId);

    java.util.List<Doctor> findByClinic_Id(Long clinicId);
}
