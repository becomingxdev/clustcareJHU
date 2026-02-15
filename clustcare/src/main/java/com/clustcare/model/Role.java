package com.clustcare.model;

/**
 * Single canonical role enum for the entire backend.
 * Stored as VARCHAR(20) in DB to avoid truncation and ENUM mismatch.
 */
public enum Role {
    ADMIN,
    CLINIC
}
