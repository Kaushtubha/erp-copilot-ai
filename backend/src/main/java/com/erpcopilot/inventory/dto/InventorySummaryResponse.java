package com.erpcopilot.inventory.dto;

public record InventorySummaryResponse(
        long totalSkus,
        long healthyStockCount,
        long lowStockCount,
        long deadStockCount,
        double totalStockValue
) {}
