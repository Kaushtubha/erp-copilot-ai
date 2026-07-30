package com.erpcopilot.inventory.dto;

import java.util.UUID;

public record LowStockAlertResponse(
        UUID productId,
        String sku,
        String name,
        String category,
        Integer quantityOnHand,
        Integer reorderLevel,
        Integer reorderQuantity,
        String preferredVendorName
) {}
