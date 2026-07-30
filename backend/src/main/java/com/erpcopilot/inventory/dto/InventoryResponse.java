package com.erpcopilot.inventory.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record InventoryResponse(
        UUID id,
        UUID productId,
        String productSku,
        String productName,
        String category,
        UUID warehouseId,
        String warehouseName,
        Integer quantityOnHand,
        Integer quantityReserved,
        Integer quantityAvailable,
        Instant lastMovementAt,
        String zone,
        String binLocation
) {}
