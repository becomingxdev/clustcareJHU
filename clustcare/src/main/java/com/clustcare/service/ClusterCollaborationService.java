package com.clustcare.service;

import com.clustcare.dto.*;
import com.clustcare.model.*;
import com.clustcare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClusterCollaborationService {

    private final ClinicRepository clinicRepository;
    private final DoctorRepository doctorRepository;
    private final InventoryRepository inventoryRepository;
    private final PatientRepository patientRepository;
    private final ClusterMedicineRequestRepository medicineRequestRepository;
    private final ClusterPatientRequestRepository patientRequestRepository;

    /**
     * Get details of the requesting clinic (myself)
     */
    public ClusterClinicDTO getMyself(String clinicUsername) {
        Clinic clinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));
        return new ClusterClinicDTO(clinic.getId(), clinic.getName(), clinic.getLocation());
    }

    /**
     * Get all clinics in the same cluster (excluding the requesting clinic)
     */
    public List<ClusterClinicDTO> getClinicsInCluster(String clinicUsername) {
        Clinic clinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        if (clinic.getCluster() == null) {
            throw new RuntimeException("Clinic does not belong to any cluster");
        }

        Long clusterId = clinic.getCluster().getId();

        return clinicRepository.findAll().stream()
                .filter(c -> c.getCluster() != null && c.getCluster().getId().equals(clusterId))
                .filter(c -> !c.getId().equals(clinic.getId())) // Exclude self
                .map(c -> new ClusterClinicDTO(c.getId(), c.getName(), c.getLocation()))
                .collect(Collectors.toList());
    }

    /**
     * Get doctors from a specific clinic in the same cluster
     */
    public List<ClusterDoctorDTO> getClinicDoctors(String clinicUsername, Long targetClinicId) {
        Clinic requestingClinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        Clinic targetClinic = clinicRepository.findById(targetClinicId)
                .orElseThrow(() -> new RuntimeException("Target clinic not found"));

        // Verify both clinics are in the same cluster
        validateSameCluster(requestingClinic, targetClinic);

        return doctorRepository.findByClinic_Id(targetClinicId).stream()
                .map(d -> new ClusterDoctorDTO(d.getName(), d.getSpecialization(), d.getActive()))
                .collect(Collectors.toList());
    }

    /**
     * Get inventory from a specific clinic in the same cluster
     */
    public List<ClusterInventoryDTO> getClinicInventory(String clinicUsername, Long targetClinicId) {
        Clinic requestingClinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        Clinic targetClinic = clinicRepository.findById(targetClinicId)
                .orElseThrow(() -> new RuntimeException("Target clinic not found"));

        // Verify both clinics are in the same cluster
        validateSameCluster(requestingClinic, targetClinic);

        return inventoryRepository.findByClinicId(targetClinicId).stream()
                .map(i -> new ClusterInventoryDTO(i.getMedicineName(), i.getQuantityAvailable()))
                .collect(Collectors.toList());
    }

    /**
     * Create a medicine request
     */
    @Transactional
    public MedicineRequestDTO createMedicineRequest(String clinicUsername, Long toClinicId,
            String medicineName, Integer quantity) {
        Clinic fromClinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        Clinic toClinic = clinicRepository.findById(toClinicId)
                .orElseThrow(() -> new RuntimeException("Target clinic not found"));

        // Validate same cluster
        validateSameCluster(fromClinic, toClinic);

        // Validate not requesting from self
        if (fromClinic.getId().equals(toClinic.getId())) {
            throw new RuntimeException("Cannot request from your own clinic");
        }

        ClusterMedicineRequest request = new ClusterMedicineRequest();
        request.setFromClinic(fromClinic);
        request.setToClinic(toClinic);
        request.setMedicineName(medicineName);
        request.setRequestedQuantity(quantity);
        request.setStatus(ClusterMedicineRequest.RequestStatus.PENDING);

        ClusterMedicineRequest saved = medicineRequestRepository.save(request);
        return convertToMedicineRequestDTO(saved);
    }

    /**
     * Get all medicine requests for a clinic (sent and received)
     */
    public List<MedicineRequestDTO> getMedicineRequests(String clinicUsername) {
        Clinic clinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        return medicineRequestRepository.findAllByClinicId(clinic.getId()).stream()
                .map(this::convertToMedicineRequestDTO)
                .collect(Collectors.toList());
    }

    /**
     * Approve or reject a medicine request
     */
    @Transactional
    public MedicineRequestDTO updateMedicineRequestStatus(String clinicUsername, Long requestId,
            String action) {
        Clinic clinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        ClusterMedicineRequest request = medicineRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Only the receiving clinic can approve/reject
        if (!request.getToClinic().getId().equals(clinic.getId())) {
            throw new RuntimeException("Unauthorized: You can only respond to requests sent to your clinic");
        }

        if (request.getStatus() != ClusterMedicineRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Request has already been processed");
        }

        if ("APPROVE".equalsIgnoreCase(action)) {
            request.setStatus(ClusterMedicineRequest.RequestStatus.APPROVED);

            // Transfer inventory
            transferMedicine(request.getToClinic().getId(), request.getFromClinic().getId(),
                    request.getMedicineName(), request.getRequestedQuantity());
        } else if ("REJECT".equalsIgnoreCase(action)) {
            request.setStatus(ClusterMedicineRequest.RequestStatus.REJECTED);
        } else {
            throw new RuntimeException("Invalid action. Use APPROVE or REJECT");
        }

        ClusterMedicineRequest updated = medicineRequestRepository.save(request);
        return convertToMedicineRequestDTO(updated);
    }

    /**
     * Transfer medicine from one clinic to another (atomic transaction)
     */
    @Transactional
    protected void transferMedicine(Long fromClinicId, Long toClinicId, String medicineName, Integer quantity) {
        // Find medicine in source clinic
        List<Inventory> sourceInventory = inventoryRepository.findByClinicId(fromClinicId).stream()
                .filter(i -> i.getMedicineName().equalsIgnoreCase(medicineName))
                .collect(Collectors.toList());

        if (sourceInventory.isEmpty()) {
            throw new RuntimeException("Medicine not found in source clinic inventory");
        }

        Inventory source = sourceInventory.get(0);

        if (source.getQuantityAvailable() < quantity) {
            throw new RuntimeException("Insufficient quantity in source clinic");
        }

        // Deduct from source
        source.setQuantityAvailable(source.getQuantityAvailable() - quantity);
        inventoryRepository.save(source);

        // Add to destination
        Clinic toClinic = clinicRepository.findById(toClinicId)
                .orElseThrow(() -> new RuntimeException("Destination clinic not found"));

        Clinic fromClinic = clinicRepository.findById(fromClinicId)
                .orElseThrow(() -> new RuntimeException("Source clinic not found"));

        List<Inventory> destInventory = inventoryRepository.findByClinicId(toClinicId).stream()
                .filter(i -> i.getMedicineName().equalsIgnoreCase(medicineName))
                .collect(Collectors.toList());

        if (destInventory.isEmpty()) {
            // Create new inventory entry
            Inventory newInventory = new Inventory();
            newInventory.setClinic(toClinic);
            newInventory.setMedicineName(medicineName);
            newInventory.setQuantityAvailable(quantity);
            newInventory.setDescription("Transferred from " + fromClinic.getName());
            newInventory.setExpiryDate(source.getExpiryDate());
            inventoryRepository.save(newInventory);
        } else {
            // Update existing inventory
            Inventory dest = destInventory.get(0);
            dest.setQuantityAvailable(dest.getQuantityAvailable() + quantity);
            inventoryRepository.save(dest);
        }
    }

    /**
     * Create a patient record request
     */
    @Transactional
    public PatientRequestDTO createPatientRequest(String clinicUsername, Long toClinicId, Long patientId) {
        Clinic fromClinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        Clinic toClinic = clinicRepository.findById(toClinicId)
                .orElseThrow(() -> new RuntimeException("Target clinic not found"));

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Validate same cluster
        validateSameCluster(fromClinic, toClinic);

        // Validate patient belongs to target clinic
        if (!patient.getClinic().getId().equals(toClinic.getId())) {
            throw new RuntimeException("Patient does not belong to the target clinic");
        }

        // Validate not requesting from self
        if (fromClinic.getId().equals(toClinic.getId())) {
            throw new RuntimeException("Cannot request from your own clinic");
        }

        ClusterPatientRequest request = new ClusterPatientRequest();
        request.setFromClinic(fromClinic);
        request.setToClinic(toClinic);
        request.setPatient(patient);
        request.setStatus(ClusterPatientRequest.RequestStatus.PENDING);

        ClusterPatientRequest saved = patientRequestRepository.save(request);
        return convertToPatientRequestDTO(saved);
    }

    /**
     * Get all patient requests for a clinic (sent and received)
     */
    public List<PatientRequestDTO> getPatientRequests(String clinicUsername) {
        Clinic clinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        return patientRequestRepository.findAllByClinicId(clinic.getId()).stream()
                .map(this::convertToPatientRequestDTO)
                .collect(Collectors.toList());
    }

    /**
     * Approve or reject a patient request
     */
    @Transactional
    public PatientRequestDTO updatePatientRequestStatus(String clinicUsername, Long requestId, String action) {
        Clinic clinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        ClusterPatientRequest request = patientRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Only the receiving clinic can approve/reject
        if (!request.getToClinic().getId().equals(clinic.getId())) {
            throw new RuntimeException("Unauthorized: You can only respond to requests sent to your clinic");
        }

        if (request.getStatus() != ClusterPatientRequest.RequestStatus.PENDING) {
            throw new RuntimeException("Request has already been processed");
        }

        if ("APPROVE".equalsIgnoreCase(action)) {
            request.setStatus(ClusterPatientRequest.RequestStatus.APPROVED);

            // Copy patient record
            copyPatientRecord(request.getPatient(), request.getFromClinic());
        } else if ("REJECT".equalsIgnoreCase(action)) {
            request.setStatus(ClusterPatientRequest.RequestStatus.REJECTED);
        } else {
            throw new RuntimeException("Invalid action. Use APPROVE or REJECT");
        }

        ClusterPatientRequest updated = patientRequestRepository.save(request);
        return convertToPatientRequestDTO(updated);
    }

    /**
     * Copy patient record to requesting clinic
     */
    @Transactional
    protected void copyPatientRecord(Patient originalPatient, Clinic destinationClinic) {
        Patient copiedPatient = Patient.builder()
                .name(originalPatient.getName())
                .age(originalPatient.getAge())
                .gender(originalPatient.getGender())
                .clinic(destinationClinic)
                .discharged(false) // New copy is not discharged
                .build();

        patientRepository.save(copiedPatient);
    }

    /**
     * Validate that two clinics belong to the same cluster
     */
    private void validateSameCluster(Clinic clinic1, Clinic clinic2) {
        if (clinic1.getCluster() == null || clinic2.getCluster() == null) {
            throw new RuntimeException("One or both clinics do not belong to any cluster");
        }

        if (!clinic1.getCluster().getId().equals(clinic2.getCluster().getId())) {
            throw new RuntimeException("Clinics must belong to the same cluster");
        }
    }

    /**
     * Convert entity to DTO
     */
    private MedicineRequestDTO convertToMedicineRequestDTO(ClusterMedicineRequest request) {
        return new MedicineRequestDTO(
                request.getId(),
                request.getFromClinic().getId(),
                request.getFromClinic().getName(),
                request.getToClinic().getId(),
                request.getToClinic().getName(),
                request.getMedicineName(),
                request.getRequestedQuantity(),
                request.getStatus().name(),
                request.getCreatedAt(),
                request.getUpdatedAt());
    }

    /**
     * Convert entity to DTO
     */
    private PatientRequestDTO convertToPatientRequestDTO(ClusterPatientRequest request) {
        return new PatientRequestDTO(
                request.getId(),
                request.getFromClinic().getId(),
                request.getFromClinic().getName(),
                request.getToClinic().getId(),
                request.getToClinic().getName(),
                request.getPatient().getId(),
                request.getPatient().getName(),
                request.getStatus().name(),
                request.getCreatedAt(),
                request.getUpdatedAt());
    }
}
