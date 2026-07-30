package com.erpcopilot.inventory.service;

import com.erpcopilot.inventory.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class InventoryService {

    public Page<InventoryResponse> findAll(String warehouseId, String category, Boolean lowStock, Boolean deadStock, Pageable pageable) {
        return new PageImpl<>(Collections.emptyList(), pageable, 0);
    }

    public InventoryResponse findById(UUID id) {
        return new InventoryResponse(id, UUID.randomUUID(), "SKU-001", "Sample Item", "Electronics", UUID.randomUUID(), "Mumbai WH", 100, 10, 90, null, "A", "A-101");
    }

    public List<LowStockAlertResponse> getLowStockAlerts() {
        return Collections.emptyList();
    }

    public List<InventoryResponse> getDeadStock() {
        return Collections.emptyList();
    }

    public InventorySummaryResponse getSummary() {
        return new InventorySummaryResponse(10, 6, 2, 2, 850000.00);
    }

    public InventoryResponse adjustQuantity(UUID id, InventoryAdjustRequest request) {
        return findById(id);
    }
}
