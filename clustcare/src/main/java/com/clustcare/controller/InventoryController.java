package com.clustcare.controller;

import com.clustcare.model.Inventory;
import com.clustcare.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/clinic/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {

    private final InventoryService inventoryService;

    /**
     * GET /api/clinic/inventory - Fetch all inventory for the logged-in clinic
     */
    @GetMapping
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<List<Inventory>> getInventory(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        List<Inventory> inventory = inventoryService.getClinicInventory(principal.getName());
        return ResponseEntity.ok(inventory);
    }

    /**
     * POST /api/clinic/inventory - Add a new medicine to inventory
     */
    @PostMapping
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<Inventory> addMedicine(@RequestBody Inventory inventory, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            Inventory savedInventory = inventoryService.addMedicine(inventory, principal.getName());
            return ResponseEntity.ok(savedInventory);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    /**
     * PUT /api/clinic/inventory/{id} - Update an existing medicine
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<Inventory> updateMedicine(
            @PathVariable Long id,
            @RequestBody Inventory inventory,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            Inventory updatedInventory = inventoryService.updateMedicine(id, inventory, principal.getName());
            return ResponseEntity.ok(updatedInventory);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Unauthorized")) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.status(404).build();
        }
    }

    /**
     * DELETE /api/clinic/inventory/{id} - Delete a medicine from inventory
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CLINIC')")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            inventoryService.deleteMedicine(id, principal.getName());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Unauthorized")) {
                return ResponseEntity.status(403).build();
            }
            return ResponseEntity.status(404).build();
        }
    }
}
