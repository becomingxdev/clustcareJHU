package com.clustcare.service;

import com.clustcare.model.Clinic;
import com.clustcare.model.Inventory;
import com.clustcare.repository.ClinicRepository;
import com.clustcare.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ClinicRepository clinicRepository;

    /**
     * Get all inventory items for a clinic by username
     * 
     * @param clinicUsername The clinic's username from JWT
     * @return List of inventory items
     */
    public List<Inventory> getClinicInventory(String clinicUsername) {
        Clinic clinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        return inventoryRepository.findByClinicId(clinic.getId());
    }

    /**
     * Add a new medicine to the inventory
     * 
     * @param inventory      The inventory item to add
     * @param clinicUsername The clinic's username from JWT
     * @return The saved inventory item
     */
    @Transactional
    public Inventory addMedicine(Inventory inventory, String clinicUsername) {
        Clinic clinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        // Ensure the inventory belongs to the authenticated clinic
        inventory.setClinic(clinic);
        inventory.setId(null); // Ensure new entity

        return inventoryRepository.save(inventory);
    }

    /**
     * Update an existing medicine in the inventory
     * 
     * @param id               The inventory item ID
     * @param updatedInventory The updated inventory data
     * @param clinicUsername   The clinic's username from JWT
     * @return The updated inventory item
     */
    @Transactional
    public Inventory updateMedicine(Long id, Inventory updatedInventory, String clinicUsername) {
        Clinic clinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        Inventory existingInventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));

        // Verify ownership
        if (!existingInventory.getClinic().getId().equals(clinic.getId())) {
            throw new RuntimeException("Unauthorized: This inventory item does not belong to your clinic");
        }

        // Update fields
        existingInventory.setMedicineName(updatedInventory.getMedicineName());
        existingInventory.setDescription(updatedInventory.getDescription());
        existingInventory.setExpiryDate(updatedInventory.getExpiryDate());
        existingInventory.setQuantityAvailable(updatedInventory.getQuantityAvailable());

        return inventoryRepository.save(existingInventory);
    }

    /**
     * Delete a medicine from the inventory
     * 
     * @param id             The inventory item ID
     * @param clinicUsername The clinic's username from JWT
     */
    @Transactional
    public void deleteMedicine(Long id, String clinicUsername) {
        Clinic clinic = clinicRepository.findByUsername(clinicUsername)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));

        // Verify ownership
        if (!inventory.getClinic().getId().equals(clinic.getId())) {
            throw new RuntimeException("Unauthorized: This inventory item does not belong to your clinic");
        }

        inventoryRepository.delete(inventory);
    }
}
