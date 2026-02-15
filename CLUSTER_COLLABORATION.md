# Cluster Collaboration System - Feature Documentation

## Overview
The Cluster Collaboration System enables clinics within the same cluster to share resources, view limited data, and request assistance (medicines or patient records) from each other. This feature fosters coordination while maintaining strict data privacy and security.

## 🔒 Security & Privacy
- **Access Control**: Only users with `CLINIC` role can access these features.
- **Cluster Isolation**: Clinics can ONLY see and interact with other clinics in their assigned cluster.
- **Data Minimization**:
  - Doctors view: Shows Name, Specialization, Status (Active/Inactive). No personal contact info.
  - Inventory view: Shows Medicine Name, Quantity. No internal details.
  - Patient Requests: Only approved requests transfer data. Original patient records are never exposed until approved.

## 🛠️ Components Implemented

### Backend (Spring Boot)
1.  **New Entities**:
    - `ClusterMedicineRequest`: Tracks medicine requests and status.
    - `ClusterPatientRequest`: Tracks patient record transfer requests.
2.  **Service Layer**: `ClusterCollaborationService`
    - Handles logic for fetching cluster members.
    - Atomic transaction handling for medicine transfers.
    - Patient record copying logic (preserving original).
3.  **Controller**: `ClusterCollaborationController` (`/api/clinic/cluster/*`)
    - `/clinics`: List partners in cluster.
    - `/me`: Get current clinic details (ID/Name).
    - `/medicine-requests`: Manage medicine workflows.
    - `/patient-requests`: Manage patient workflows.
4.  **DTOs**: Lightweight objects to ensure no sensitive data leaks (e.g., `ClusterDoctorDTO`, `ClusterClinicDTO`).

### Frontend (React)
1.  **Cluster Page**: `/clinic-dashboard/cluster`
    - **Network Tab**: Grid view of partner clinics with action buttons.
    - **Requests Tabs**: Manage Sent and Received requests.
2.  **Modals**:
    - `ViewDoctorsModal`: See doctor availability.
    - `ViewInventoryModal`: See medicine stock.
    - `RequestMedicineModal`: Send requests for supplies.
    - `RequestPatientModal`: Request patient transfer by ID.

## 🧪 Testing Guide

### 1. View Network
- Navigate to "Cluster" in sidebar.
- You should see other clinics in your cluster (if any exist).
- *Verify*: You should NOT see your own clinic cards.

### 2. View Shared Data
- Click "View Doctors" on a partner clinic.
- Click "View Inventory" on a partner clinic.
- *Verify*: Data loads and matches what is in the database for that clinic.

### 3. Medicine Request (Workflow)
- **Clinic A**: Click "Request Meds" on Clinic B card -> Enter "Paracetamol", Qty "10".
- **Clinic B**: Go to "Medicine Requests" -> Filter "Received" -> Click "Approve".
- *Verify*: 
    - Clinic A's inventory increases by 10.
    - Clinic B's inventory decreases by 10.
    - Request status becomes APPROVED.

### 4. Patient Request (Workflow)
- **Clinic A**: Click "Request Patient" on Clinic B card -> Enter Patient ID (e.g., 1).
- **Clinic B**: Go to "Patient Requests" -> Filter "Received" -> Click "Approve".
- *Verify*: 
    - Clinic A now has a copy of Patient 1 in their "Patients" list.
    - Original Patient 1 at Clinic B remains unchanged.

## 📋 Database Schema
The system automatically creates these tables:
- `cluster_medicine_requests`
- `cluster_patient_requests`

No manual SQL execution is required.
