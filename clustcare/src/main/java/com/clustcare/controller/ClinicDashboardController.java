package com.clustcare.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clustcare.dto.ClinicDashboardResponse;
import com.clustcare.model.Clinic;
import com.clustcare.model.Doctor;
import com.clustcare.model.Patient;
import com.clustcare.model.Appointment;
import com.clustcare.service.ClinicDashboardService;
import com.clustcare.repository.ClinicRepository;
import com.clustcare.repository.DoctorRepository;
import com.clustcare.repository.PatientRepository;
import com.clustcare.repository.AppointmentRepository;

import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/clinic")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ClinicDashboardController {

    private final ClinicDashboardService dashboardService;
    private final ClinicRepository clinicRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<ClinicDashboardResponse> getDashboard(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        ClinicDashboardResponse stats = dashboardService.getDashboardStats(principal.getName());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/doctors")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<java.util.List<com.clustcare.model.Doctor>> getDoctors(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        java.util.List<com.clustcare.model.Doctor> doctors = dashboardService.getDoctorsForClinic(principal.getName());
        return ResponseEntity.ok(doctors);
    }

    @PostMapping("/doctors")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<Doctor> addDoctor(
            @RequestBody Doctor doctor, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String clinicUsername = principal.getName();

        Clinic clinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        doctor.setId(null);
        doctor.setClinic(clinic);
        doctor.setActive(true);

        Doctor savedDoctor = doctorRepository.save(doctor);
        return ResponseEntity.ok(savedDoctor);
    }

    @GetMapping("/patients")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<List<Patient>> getPatients(Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();

        Clinic clinic = clinicRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        return ResponseEntity.ok(patientRepository.findByClinic_Id(clinic.getId()));
    }

    @PostMapping("/patients")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<Patient> addPatient(@RequestBody Patient patient, Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();

        Clinic clinic = clinicRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        patient.setClinic(clinic);
        // Ensure ID is null for new entity
        patient.setId(null);

        return ResponseEntity.ok(patientRepository.save(patient));
    }

    @PutMapping("/patients/{id}/discharge")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<Patient> dischargePatient(@PathVariable Long id, Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();

        Clinic clinic = clinicRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (!patient.getClinic().getId().equals(clinic.getId())) {
            return ResponseEntity.status(403).build();
        }

        patient.setDischarged(true);
        return ResponseEntity.ok(patientRepository.save(patient));
    }

    @PutMapping("/doctors/{id}/toggle-status")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<Doctor> toggleDoctorStatus(@PathVariable Long id, Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();

        Clinic clinic = clinicRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!doctor.getClinic().getId().equals(clinic.getId())) {
            return ResponseEntity.status(403).build();
        }

        doctor.setActive(!doctor.getActive());
        return ResponseEntity.ok(doctorRepository.save(doctor));
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<List<Appointment>> getAppointments(Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();

        Clinic clinic = clinicRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        return ResponseEntity.ok(appointmentRepository.findAllByClinicId(clinic.getId()));
    }

    @PutMapping("/appointments/{id}/cancel")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id, Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();

        Clinic clinic = clinicRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getClinic().getId().equals(clinic.getId())) {
            return ResponseEntity.status(403).build();
        }

        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @PutMapping("/appointments/{id}/reschedule")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<Appointment> rescheduleAppointment(@PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Principal principal) {

        if (principal == null)
            return ResponseEntity.status(401).build();

        Clinic clinic = clinicRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getClinic().getId().equals(clinic.getId())) {
            return ResponseEntity.status(403).build();
        }

        appointment.setAppointmentDate(date);
        appointment.setStatus(Appointment.AppointmentStatus.BOOKED); // Reset status if it was cancelled? Usually yes.
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @PostMapping("/appointments")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Map<String, Object> payload,
            Principal principal) {
        if (principal == null)
            return ResponseEntity.status(401).build();

        Clinic clinic = clinicRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        Long patientId = Long.valueOf(payload.get("patientId").toString());
        Long doctorId = Long.valueOf(payload.get("doctorId").toString());
        LocalDate date = LocalDate.parse(payload.get("date").toString());

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // Verify ownership
        if (!patient.getClinic().getId().equals(clinic.getId()) || !doctor.getClinic().getId().equals(clinic.getId())) {
            return ResponseEntity.status(403).build();
        }

        Appointment appointment = Appointment.builder()
                .clinic(clinic)
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(date)
                .status(Appointment.AppointmentStatus.BOOKED)
                .build();

        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }
}
