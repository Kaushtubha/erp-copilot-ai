package com.erpcopilot.purchase.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record PurchaseOrderDetailResponse(
        UUID id,
        String poNumber,
        UUID vendorId,
        String vendorName,
        String status,
        LocalDate orderDate,
        LocalDate expectedDeliveryDate,
        BigDecimal totalAmount,
        String notes,
        List<ItemDetail> items
) {
    public record ItemDetail(UUID productId, String productName, Integer quantity, BigDecimal unitPrice) {}
}
