package com.clustcare.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.clustcare.model.Appointment;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    long countByClinicIdAndAppointmentDate(Long clinicId, LocalDate date);

    @Query("SELECT a FROM Appointment a WHERE a.clinic.id = :clinicId ORDER BY a.createdAt DESC")
    List<Appointment> findRecentAppointments(@Param("clinicId") Long clinicId, Pageable pageable);

    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.doctor LEFT JOIN FETCH a.patient WHERE a.clinic.id = :clinicId ORDER BY a.appointmentDate DESC")
    List<Appointment> findAllByClinicId(@Param("clinicId") Long clinicId);
}
