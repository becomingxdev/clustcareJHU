package com.clustcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for medicine request information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicineRequestDTO {
    private Long id;
    private Long fromClinicId;
    private String fromClinicName;
    private Long toClinicId;
    private String toClinicName;
    private String medicineName;
    private Integer requestedQuantity;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
