# Inventory Management Feature

## Overview
The Inventory Management feature allows clinic administrators to track and manage their medicine stock. This includes adding new medicines, updating quantities, monitoring expiry dates, and removing medicines from inventory.

## Features Implemented

### Backend (Spring Boot)
1. **Entity**: `Inventory.java`
   - Medicine name, description, expiry date, quantity
   - Automatic timestamp creation
   - ManyToOne relationship with Clinic

2. **Repository**: `InventoryRepository.java`
   - JPA repository with clinic-specific queries
   - Method: `findByClinicId(Long clinicId)`

3. **Service**: `InventoryService.java`
   - `getClinicInventory(String clinicUsername)` - Fetch all inventory for a clinic
   - `addMedicine(Inventory, String)` - Add new medicine
   - `updateMedicine(Long, Inventory, String)` - Update existing medicine
   - `deleteMedicine(Long, String)` - Remove medicine
   - All methods extract clinic from JWT (no hardcoded clinic_id)
   - Proper authorization checks

4. **Controller**: `InventoryController.java`
   - Base mapping: `/api/clinic/inventory`
   - Endpoints:
     - `GET /api/clinic/inventory` - Fetch inventory
     - `POST /api/clinic/inventory` - Add medicine
     - `PUT /api/clinic/inventory/{id}` - Update medicine
     - `DELETE /api/clinic/inventory/{id}` - Delete medicine
   - All endpoints secured with `@PreAuthorize("hasAuthority('CLINIC')")`

### Frontend (React)
1. **Pages**:
   - `Inventory.jsx` - Main inventory management page
   - Route: `/clinic-dashboard/inventory`

2. **Components**:
   - `AddMedicineModal.jsx` - Modal for adding new medicines
   - `EditMedicineModal.jsx` - Modal for editing existing medicines

3. **Features**:
   - Table view with columns: Medicine Name, Description, Expiry Date, Quantity, Status, Actions
   - Automatic status calculation:
     - **Expired**: Expiry date < today (red badge)
     - **Low Stock**: Quantity < 10 (yellow badge)
     - **In Stock**: Normal stock (green badge)
   - Add, Edit, Delete operations
   - Date picker for expiry date
   - Form validation
   - Loading and error states
   - Matches existing UI design (grayscale palette, rounded components)

### Database Schema
```sql
CREATE TABLE inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    expiry_date DATE NOT NULL,
    quantity_available INT NOT NULL,
    created_at DATETIME NOT NULL,
    clinic_id BIGINT NOT NULL,
    FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);
```

## Access Control
- **Clinic Admin**: Full access (view, add, edit, delete) to their own clinic's inventory
- **Super Admin**: No automatic access (unless system already supports it)
- Inventory is strictly clinic-specific - clinics can only see and manage their own inventory

## Testing Checklist

### Backend Testing
- [ ] Table created in database
- [ ] Foreign key constraint works correctly
- [ ] POST /api/clinic/inventory - Creates new medicine
- [ ] GET /api/clinic/inventory - Returns only clinic's inventory
- [ ] PUT /api/clinic/inventory/{id} - Updates medicine (with authorization check)
- [ ] DELETE /api/clinic/inventory/{id} - Deletes medicine (with authorization check)
- [ ] Unauthorized access returns 403
- [ ] Invalid token returns 401

### Frontend Testing
- [ ] Inventory page accessible at /clinic-dashboard/inventory
- [ ] Sidebar shows "Inventory" button
- [ ] Table displays all medicines
- [ ] Add Medicine modal opens and saves correctly
- [ ] Edit Medicine modal pre-populates and updates correctly
- [ ] Delete confirmation works
- [ ] Status badges show correct colors (Expired/Low Stock/In Stock)
- [ ] Data persists after page refresh
- [ ] No console errors
- [ ] Loading state displays correctly
- [ ] Error handling works

## API Endpoints

### GET /api/clinic/inventory
Fetch all inventory items for the authenticated clinic.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "medicineName": "Paracetamol",
    "description": "Pain reliever",
    "expiryDate": "2026-12-31",
    "quantityAvailable": 100,
    "createdAt": "2026-02-11T10:00:00"
  }
]
```

### POST /api/clinic/inventory
Add a new medicine to inventory.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "medicineName": "Paracetamol",
  "description": "Pain reliever",
  "expiryDate": "2026-12-31",
  "quantityAvailable": 100
}
```

### PUT /api/clinic/inventory/{id}
Update an existing medicine.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "medicineName": "Paracetamol",
  "description": "Updated description",
  "expiryDate": "2027-01-31",
  "quantityAvailable": 150
}
```

### DELETE /api/clinic/inventory/{id}
Delete a medicine from inventory.

**Headers:**
```
Authorization: Bearer {token}
```

## Files Created/Modified

### Backend Files Created:
- `clustcare/src/main/java/com/clustcare/model/Inventory.java`
- `clustcare/src/main/java/com/clustcare/repository/InventoryRepository.java`
- `clustcare/src/main/java/com/clustcare/service/InventoryService.java`
- `clustcare/src/main/java/com/clustcare/controller/InventoryController.java`
- `clustcare/src/main/resources/schema-inventory.sql`

### Frontend Files Created:
- `clustcare-frontend/src/pages/Inventory.jsx`
- `clustcare-frontend/src/components/AddMedicineModal.jsx`
- `clustcare-frontend/src/components/EditMedicineModal.jsx`

### Files Modified:
- `clustcare-frontend/src/App.jsx` - Added inventory route
- `clustcare-frontend/src/components/Layout.jsx` - Added inventory to sidebar

## Running the Application

### Backend
```bash
cd clustcare
.\mvnw.cmd spring-boot:run
```

The backend will run on `http://localhost:8080`

### Frontend
```bash
cd clustcare-frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Database Migration
With `spring.jpa.hibernate.ddl-auto=update` in `application.properties`, the inventory table will be automatically created when the application starts.

For manual creation or reference, use the SQL script at:
`clustcare/src/main/resources/schema-inventory.sql`

## Notes
- All data is persisted in the database
- No dummy/placeholder data - everything is backend-connected
- Follows existing code patterns and design system
- No breaking changes to existing features
- Production-ready code with proper error handling
