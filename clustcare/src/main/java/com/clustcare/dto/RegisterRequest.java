package com.clustcare.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String role; // SUPER_ADMIN, CLINIC_ADMIN, STAFF
    private Long clinicId; // Optional, for admin/staff
}