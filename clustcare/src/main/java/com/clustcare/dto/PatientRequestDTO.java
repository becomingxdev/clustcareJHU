package com.clustcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for patient record request information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientRequestDTO {
    private Long id;
    private Long fromClinicId;
    private String fromClinicName;
    private Long toClinicId;
    private String toClinicName;
    private Long patientId;
    private String patientName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
