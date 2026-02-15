package com.clustcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for exposing limited inventory information to cluster members
 * Only includes medicine name and available quantity
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClusterInventoryDTO {
    private String medicineName;
    private Integer quantityAvailable;
}
