package com.clustcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for exposing limited doctor information to cluster members
 * Only includes name, specialization, and active status
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClusterDoctorDTO {
    private String name;
    private String specialization;
    private Boolean active;
}
