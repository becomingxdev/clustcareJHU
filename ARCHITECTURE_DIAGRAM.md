# Inventory Management Feature Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React)                            │
│                     http://localhost:5173                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────┐      ┌──────────────────────────────────────┐ │
│  │   Layout.jsx    │      │         Inventory.jsx                 │ │
│  │   (Sidebar)     │─────▶│    /clinic-dashboard/inventory        │ │
│  │                 │      │                                        │ │
│  │ • Dashboard     │      │  • Fetch inventory (GET)              │ │
│  │ • Doctors       │      │  • Add medicine (POST)                │ │
│  │ • Patients      │      │  • Edit medicine (PUT)                │ │
│  │ • Appointments  │      │  • Delete medicine (DELETE)           │ │
│  │ • Inventory ✨  │      │  • Status calculation                 │ │
│  └─────────────────┘      │  • Table display                      │ │
│                            └──────────────────────────────────────┘ │
│                                       │                              │
│                            ┌──────────┴──────────┐                  │
│                            │                     │                  │
│                  ┌─────────▼─────────┐  ┌───────▼────────┐         │
│                  │ AddMedicineModal  │  │ EditMedicineModal│        │
│                  │                   │  │                  │        │
│                  │ • Medicine Name   │  │ • Pre-populated  │        │
│                  │ • Description     │  │ • Form validation│        │
│                  │ • Expiry Date     │  │ • Update logic   │        │
│                  │ • Quantity        │  │                  │        │
│                  └───────────────────┘  └──────────────────┘        │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────────┘
                                │
                                │ HTTP Requests (JWT Token)
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│                        BACKEND (Spring Boot)                           │
│                      http://localhost:8080                             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │              InventoryController.java                             │ │
│  │           /api/clinic/inventory                                   │ │
│  │                                                                    │ │
│  │  @PreAuthorize("hasAuthority('CLINIC')")                          │ │
│  │                                                                    │ │
│  │  • GET    /api/clinic/inventory        → getInventory()          │ │
│  │  • POST   /api/clinic/inventory        → addMedicine()           │ │
│  │  • PUT    /api/clinic/inventory/{id}   → updateMedicine()        │ │
│  │  • DELETE /api/clinic/inventory/{id}   → deleteMedicine()        │ │
│  │                                                                    │ │
│  │  Principal principal → Extract clinic username from JWT           │ │
│  └────────────────────────────┬───────────────────────────────────────┘ │
│                               │                                         │
│  ┌────────────────────────────▼───────────────────────────────────┐   │
│  │              InventoryService.java                              │   │
│  │                                                                  │   │
│  │  • getClinicInventory(clinicUsername)                           │   │
│  │    └─▶ Find clinic by username                                 │   │
│  │    └─▶ Return inventory for clinic                             │   │
│  │                                                                  │   │
│  │  • addMedicine(inventory, clinicUsername)                       │   │
│  │    └─▶ Find clinic by username                                 │   │
│  │    └─▶ Set clinic on inventory                                 │   │
│  │    └─▶ Save inventory                                           │   │
│  │                                                                  │   │
│  │  • updateMedicine(id, inventory, clinicUsername)                │   │
│  │    └─▶ Find clinic by username                                 │   │
│  │    └─▶ Verify ownership                                         │   │
│  │    └─▶ Update and save                                          │   │
│  │                                                                  │   │
│  │  • deleteMedicine(id, clinicUsername)                           │   │
│  │    └─▶ Find clinic by username                                 │   │
│  │    └─▶ Verify ownership                                         │   │
│  │    └─▶ Delete inventory                                         │   │
│  └────────────────────────────┬───────────────────────────────────┘   │
│                               │                                         │
│  ┌────────────────────────────▼───────────────────────────────────┐   │
│  │           InventoryRepository.java                              │   │
│  │           extends JpaRepository<Inventory, Long>                │   │
│  │                                                                  │   │
│  │  • findByClinicId(Long clinicId)                                │   │
│  │  • save(Inventory)                                              │   │
│  │  • findById(Long)                                               │   │
│  │  • delete(Inventory)                                            │   │
│  └────────────────────────────┬───────────────────────────────────┘   │
│                               │                                         │
└───────────────────────────────┼─────────────────────────────────────────┘
                                │
                                │ JPA/Hibernate
                                │
┌───────────────────────────────▼─────────────────────────────────────────┐
│                        DATABASE (MySQL)                                  │
│                     jdbc:mysql://127.0.0.1:3306/clustcare               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      inventory TABLE                                │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │  id                  BIGINT (PK, AUTO_INCREMENT)                   │ │
│  │  medicine_name       VARCHAR(255) NOT NULL                         │ │
│  │  description         VARCHAR(500)                                  │ │
│  │  expiry_date         DATE NOT NULL                                 │ │
│  │  quantity_available  INT NOT NULL                                  │ │
│  │  created_at          DATETIME NOT NULL                             │ │
│  │  clinic_id           BIGINT NOT NULL (FK → clinics.id)            │ │
│  │                                                                     │ │
│  │  CONSTRAINT: fk_inventory_clinic                                   │ │
│  │    FOREIGN KEY (clinic_id) REFERENCES clinics(id)                 │ │
│  │    ON DELETE CASCADE                                               │ │
│  │                                                                     │ │
│  │  INDEX: idx_clinic_id                                              │ │
│  │  INDEX: idx_expiry_date                                            │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                      clinics TABLE                                  │ │
│  ├────────────────────────────────────────────────────────────────────┤ │
│  │  id                  BIGINT (PK)                                   │ │
│  │  name                VARCHAR                                       │ │
│  │  location            VARCHAR                                       │ │
│  │  username            VARCHAR (UNIQUE)                              │ │
│  │  password            VARCHAR                                       │ │
│  │  is_approved         BOOLEAN                                       │ │
│  │  cluster_id          BIGINT (FK)                                   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘

## Data Flow

### 1. Fetch Inventory (GET)
User → Inventory.jsx → GET /api/clinic/inventory (JWT) 
     → InventoryController → InventoryService.getClinicInventory(username)
     → Find Clinic by username → InventoryRepository.findByClinicId(clinicId)
     → Database → Return List<Inventory> → Display in table

### 2. Add Medicine (POST)
User → AddMedicineModal → POST /api/clinic/inventory (JWT + medicine data)
     → InventoryController → InventoryService.addMedicine(inventory, username)
     → Find Clinic by username → Set clinic on inventory
     → InventoryRepository.save() → Database → Return saved Inventory
     → Refresh table

### 3. Update Medicine (PUT)
User → EditMedicineModal → PUT /api/clinic/inventory/{id} (JWT + updated data)
     → InventoryController → InventoryService.updateMedicine(id, inventory, username)
     → Find Clinic by username → Find Inventory by id
     → Verify ownership (clinic match) → Update fields
     → InventoryRepository.save() → Database → Return updated Inventory
     → Refresh table

### 4. Delete Medicine (DELETE)
User → Inventory.jsx → DELETE /api/clinic/inventory/{id} (JWT)
     → InventoryController → InventoryService.deleteMedicine(id, username)
     → Find Clinic by username → Find Inventory by id
     → Verify ownership (clinic match) → InventoryRepository.delete()
     → Database → Return success → Refresh table

## Security Flow

```
User Login → JWT Token Generated (contains username + role)
           ↓
Frontend stores token in localStorage
           ↓
Every API request includes: Authorization: Bearer {token}
           ↓
JwtAuthenticationFilter validates token
           ↓
SecurityContext populated with Principal (username + authorities)
           ↓
@PreAuthorize("hasAuthority('CLINIC')") checks role
           ↓
Controller extracts username from Principal
           ↓
Service uses username to find clinic (NO hardcoded clinic_id)
           ↓
Repository filters by clinic_id
           ↓
Database returns only clinic-specific data
```

## Status Calculation Logic

```javascript
const getStatus = (expiryDate, quantity) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  
  if (expiry < today) {
    return { label: 'Expired', color: 'bg-red-100 text-red-700' };
  } else if (quantity < 10) {
    return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700' };
  } else {
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
  }
};
```

## Entity Relationships

```
Cluster (1) ──────< (N) Clinic (1) ──────< (N) Inventory
                            │
                            ├──────< (N) Doctor
                            ├──────< (N) Patient
                            └──────< (N) Appointment
```

Each Clinic can have:
- Multiple Inventory items (medicines)
- Multiple Doctors
- Multiple Patients
- Multiple Appointments

Inventory items are:
- Strictly associated with ONE clinic
- Automatically deleted if clinic is deleted (CASCADE)
- Isolated from other clinics (data privacy)
