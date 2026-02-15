package com.clustcare.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clustcare.dto.ClinicDashboardResponse;
import com.clustcare.dto.ClinicDashboardResponse.RecentActivityDto;
import com.clustcare.model.Appointment;
import com.clustcare.model.Clinic;
import com.clustcare.model.Doctor;
import com.clustcare.repository.AppointmentRepository;
import com.clustcare.repository.ClinicRepository;
import com.clustcare.repository.DoctorRepository;
import com.clustcare.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClinicDashboardService {

    private final ClinicRepository clinicRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    @Transactional(readOnly = true)
    public ClinicDashboardResponse getDashboardStats(String username) {
        // 1. Resolve Clinic
        Clinic clinic = resolveClinic(username);
        Long clinicId = clinic.getId();

        // 2. Fetch Counts
        long totalPatients = patientRepository.countByClinicId(clinicId);
        long activeDoctors = doctorRepository.countByClinicIdAndActiveTrue(clinicId);
        long todayAppointments = appointmentRepository.countByClinicIdAndAppointmentDate(clinicId, LocalDate.now());

        // 3. Fetch Recent Activities (Appointments for now)
        List<Appointment> recentAppointments = appointmentRepository.findRecentAppointments(clinicId,
                PageRequest.of(0, 5));

        // Map to DTO
        List<RecentActivityDto> activities = recentAppointments.stream()
                .map(this::mapAppointmentToActivity)
                .collect(Collectors.toList());

        // Construct Response
        return ClinicDashboardResponse.builder()
                .totalPatients(totalPatients)
                .activeDoctors(activeDoctors)
                .todayAppointments(todayAppointments)
                .recentActivities(activities)
                .build();
    }

    @Transactional(readOnly = true)
    public List<Doctor> getDoctorsForClinic(String username) {
        Clinic clinic = resolveClinic(username);
        // Debugging log: remove later in production cleanup
        System.out.println("Fetching doctors for Clinic: " + clinic.getName() + " (ID: " + clinic.getId() + ")");
        return doctorRepository.findByClinic_Id(clinic.getId());
    }

    private Clinic resolveClinic(String username) {
        return clinicRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Clinic not found for user: " + username));
    }

    private RecentActivityDto mapAppointmentToActivity(Appointment appointment) {
        String timeAgo = calculateTimeAgo(appointment.getCreatedAt());
        String description = "New Appointment: " + appointment.getPatient().getName() +
                " with Dr. " + appointment.getDoctor().getName();

        return new RecentActivityDto(description, timeAgo, "APPOINTMENT");
    }

    private String calculateTimeAgo(java.time.LocalDateTime dateTime) {
        if (dateTime == null)
            return "Just now";

        long minutes = ChronoUnit.MINUTES.between(dateTime, java.time.LocalDateTime.now());
        if (minutes < 1)
            return "Just now";
        if (minutes < 60)
            return minutes + " mins ago";

        long hours = ChronoUnit.HOURS.between(dateTime, java.time.LocalDateTime.now());
        if (hours < 24)
            return hours + " hrs ago";

        return dateTime.format(DateTimeFormatter.ofPattern("MMM dd"));
    }
}
