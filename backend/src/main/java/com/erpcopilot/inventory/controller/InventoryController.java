package com.erpcopilot.inventory.controller;

import com.erpcopilot.inventory.dto.*;
import com.erpcopilot.inventory.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Inventory REST controller.
 */
@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory", description = "Inventory management endpoints")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @Operation(summary = "Get all inventory with optional filters")
    public ResponseEntity<Page<InventoryResponse>> getAll(
            @RequestParam(required = false) String warehouseId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean lowStock,
            @RequestParam(required = false) Boolean deadStock,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(inventoryService.findAll(warehouseId, category, lowStock, deadStock, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get inventory by ID")
    public ResponseEntity<InventoryResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(inventoryService.findById(id));
    }

    @GetMapping("/low-stock")
    @Operation(summary = "Get all low-stock items across all warehouses")
    public ResponseEntity<List<LowStockAlertResponse>> getLowStock() {
        return ResponseEntity.ok(inventoryService.getLowStockAlerts());
    }

    @GetMapping("/dead-stock")
    @Operation(summary = "Get dead stock items (no movement for 90+ days)")
    public ResponseEntity<List<InventoryResponse>> getDeadStock() {
        return ResponseEntity.ok(inventoryService.getDeadStock());
    }

    @GetMapping("/summary")
    @Operation(summary = "Get inventory summary KPIs")
    public ResponseEntity<InventorySummaryResponse> getSummary() {
        return ResponseEntity.ok(inventoryService.getSummary());
    }

    @PatchMapping("/{id}/adjust")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    @Operation(summary = "Manually adjust inventory quantity")
    public ResponseEntity<InventoryResponse> adjustQuantity(
            @PathVariable UUID id,
            @Valid @RequestBody InventoryAdjustRequest request) {
        return ResponseEntity.ok(inventoryService.adjustQuantity(id, request));
    }
}
