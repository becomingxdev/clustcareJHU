-- Inventory Table Creation Script
-- This script creates the inventory table for medicine management
-- Note: With spring.jpa.hibernate.ddl-auto=update, Hibernate will auto-create this table.
-- This script is provided for manual execution or reference purposes.

CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    expiry_date DATE NOT NULL,
    quantity_available INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    clinic_id BIGINT NOT NULL,
    
    -- Foreign Key Constraint
    CONSTRAINT fk_inventory_clinic 
        FOREIGN KEY (clinic_id) 
        REFERENCES clinics(id) 
        ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_clinic_id (clinic_id),
    INDEX idx_expiry_date (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Add some sample data for testing (uncomment if needed)
-- INSERT INTO inventory (medicine_name, description, expiry_date, quantity_available, created_at, clinic_id)
-- VALUES 
--     ('Paracetamol', 'Pain reliever and fever reducer', '2026-12-31', 100, NOW(), 1),
--     ('Amoxicillin', 'Antibiotic for bacterial infections', '2026-06-30', 50, NOW(), 1),
--     ('Ibuprofen', 'Anti-inflammatory medication', '2025-03-15', 5, NOW(), 1);
