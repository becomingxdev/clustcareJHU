package com.clustcare.controller;

import com.clustcare.dto.*;
import com.clustcare.service.ClusterCollaborationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clinic/cluster")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ClusterCollaborationController {

    private final ClusterCollaborationService clusterService;

    /**
     * GET /api/clinic/cluster/me - Get details of the current clinic
     */
    @GetMapping("/me")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<ClusterClinicDTO> getMe(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(clusterService.getMyself(principal.getName()));
    }

    /**
     * GET /api/clinic/cluster/clinics - Get all clinics in the same cluster
     */
    @GetMapping("/clinics")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<List<ClusterClinicDTO>> getClinicsInCluster(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            List<ClusterClinicDTO> clinics = clusterService.getClinicsInCluster(principal.getName());
            return ResponseEntity.ok(clinics);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    /**
     * GET /api/clinic/cluster/clinics/{clinicId}/doctors - Get doctors from a
     * specific clinic
     */
    @GetMapping("/clinics/{clinicId}/doctors")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<List<ClusterDoctorDTO>> getClinicDoctors(
            @PathVariable Long clinicId, Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            List<ClusterDoctorDTO> doctors = clusterService.getClinicDoctors(principal.getName(), clinicId);
            return ResponseEntity.ok(doctors);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("same cluster")) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.status(404).build();
        }
    }

    /**
     * GET /api/clinic/cluster/clinics/{clinicId}/inventory - Get inventory from a
     * specific clinic
     */
    @GetMapping("/clinics/{clinicId}/inventory")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<List<ClusterInventoryDTO>> getClinicInventory(
            @PathVariable Long clinicId, Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            List<ClusterInventoryDTO> inventory = clusterService.getClinicInventory(principal.getName(), clinicId);
            return ResponseEntity.ok(inventory);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("same cluster")) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.status(404).build();
        }
    }

    /**
     * POST /api/clinic/cluster/medicine-requests - Create a medicine request
     */
    @PostMapping("/medicine-requests")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<MedicineRequestDTO> createMedicineRequest(
            @RequestBody Map<String, Object> payload, Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            Long toClinicId = Long.valueOf(payload.get("toClinicId").toString());
            String medicineName = payload.get("medicineName").toString();
            Integer quantity = Integer.valueOf(payload.get("quantity").toString());

            MedicineRequestDTO request = clusterService.createMedicineRequest(
                    principal.getName(), toClinicId, medicineName, quantity);

            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    /**
     * GET /api/clinic/cluster/medicine-requests - Get all medicine requests
     */
    @GetMapping("/medicine-requests")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<List<MedicineRequestDTO>> getMedicineRequests(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            List<MedicineRequestDTO> requests = clusterService.getMedicineRequests(principal.getName());
            return ResponseEntity.ok(requests);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    /**
     * PUT /api/clinic/cluster/medicine-requests/{id} - Approve or reject a medicine
     * request
     */
    @PutMapping("/medicine-requests/{id}")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<MedicineRequestDTO> updateMedicineRequest(
            @PathVariable Long id, @RequestBody Map<String, String> payload, Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            String action = payload.get("action");
            MedicineRequestDTO updated = clusterService.updateMedicineRequestStatus(
                    principal.getName(), id, action);

            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Unauthorized")) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.status(400).body(null);
        }
    }

    /**
     * POST /api/clinic/cluster/patient-requests - Create a patient record request
     */
    @PostMapping("/patient-requests")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<PatientRequestDTO> createPatientRequest(
            @RequestBody Map<String, Object> payload, Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            Long toClinicId = Long.valueOf(payload.get("toClinicId").toString());
            Long patientId = Long.valueOf(payload.get("patientId").toString());

            PatientRequestDTO request = clusterService.createPatientRequest(
                    principal.getName(), toClinicId, patientId);

            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    /**
     * GET /api/clinic/cluster/patient-requests - Get all patient requests
     */
    @GetMapping("/patient-requests")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<List<PatientRequestDTO>> getPatientRequests(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            List<PatientRequestDTO> requests = clusterService.getPatientRequests(principal.getName());
            return ResponseEntity.ok(requests);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    /**
     * PUT /api/clinic/cluster/patient-requests/{id} - Approve or reject a patient
     * request
     */
    @PutMapping("/patient-requests/{id}")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<PatientRequestDTO> updatePatientRequest(
            @PathVariable Long id, @RequestBody Map<String, String> payload, Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            String action = payload.get("action");
            PatientRequestDTO updated = clusterService.updatePatientRequestStatus(
                    principal.getName(), id, action);

            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Unauthorized")) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.status(400).body(null);
        }
    }
}
