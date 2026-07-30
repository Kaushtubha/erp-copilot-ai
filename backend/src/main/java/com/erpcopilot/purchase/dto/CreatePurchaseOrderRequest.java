package com.erpcopilot.purchase.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CreatePurchaseOrderRequest(
        @NotNull UUID vendorId,
        @NotNull LocalDate expectedDeliveryDate,
        String notes,
        @NotNull List<ItemRequest> items
) {
    public record ItemRequest(UUID productId, Integer quantity) {}
}
