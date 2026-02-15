package com.clustcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for exposing limited clinic information to cluster members
 * Does NOT include sensitive data like passwords or usernames
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClusterClinicDTO {
    private Long id;
    private String name;
    private String location;
}
