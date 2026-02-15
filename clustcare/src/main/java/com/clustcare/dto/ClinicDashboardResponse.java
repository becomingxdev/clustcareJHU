package com.clustcare.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClinicDashboardResponse {
    private long totalPatients;
    private long activeDoctors;
    private long todayAppointments;
    private List<RecentActivityDto> recentActivities;

    @Data
    @AllArgsConstructor
    public static class RecentActivityDto {
        private String description;
        private String time; // e.g., "2 mins ago" or ISO timestamp
        private String type; // APPOINTMENT, PATIENT, REPORT, etc.
    }
}
