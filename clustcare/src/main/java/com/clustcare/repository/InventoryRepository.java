package com.clustcare.repository;

import com.clustcare.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    /**
     * Find all inventory items for a specific clinic
     * 
     * @param clinicId The clinic ID
     * @return List of inventory items
     */
    List<Inventory> findByClinicId(Long clinicId);
}
