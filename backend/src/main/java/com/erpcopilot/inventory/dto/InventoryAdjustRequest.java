package com.erpcopilot.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record InventoryAdjustRequest(
        @NotNull @Min(0) Integer newQuantity,
        String reason
) {}
