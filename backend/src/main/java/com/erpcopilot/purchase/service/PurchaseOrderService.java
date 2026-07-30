package com.erpcopilot.purchase.service;

import com.erpcopilot.purchase.dto.*;
import com.erpcopilot.purchase.entity.PurchaseOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class PurchaseOrderService {

    public Page<PurchaseOrderResponse> findAll(String status, String vendorId, Boolean delayed, Pageable pageable) {
        return new PageImpl<>(Collections.emptyList(), pageable, 0);
    }

    public PurchaseOrderDetailResponse findById(UUID id) {
        return new PurchaseOrderDetailResponse(id, "PO-2024-001", UUID.randomUUID(), "TechSupply Co.", "APPROVED", LocalDate.now(), LocalDate.now().plusDays(5), BigDecimal.valueOf(42500), "Sample notes", Collections.emptyList());
    }

    public List<PurchaseOrderResponse> getDelayedOrders() {
        return Collections.emptyList();
    }

    public PurchaseOrderDetailResponse create(CreatePurchaseOrderRequest request) {
        return findById(UUID.randomUUID());
    }

    public PurchaseOrderResponse approve(UUID id) {
        return new PurchaseOrderResponse(id, "PO-2024-001", UUID.randomUUID(), "TechSupply Co.", "APPROVED", LocalDate.now(), LocalDate.now().plusDays(5), BigDecimal.valueOf(42500), false);
    }

    public PurchaseOrderResponse cancel(UUID id) {
        return new PurchaseOrderResponse(id, "PO-2024-001", UUID.randomUUID(), "TechSupply Co.", "CANCELLED", LocalDate.now(), LocalDate.now().plusDays(5), BigDecimal.valueOf(42500), false);
    }

    public PurchaseOrderResponse updateStatus(UUID id, PurchaseOrder.Status status) {
        return new PurchaseOrderResponse(id, "PO-2024-001", UUID.randomUUID(), "TechSupply Co.", status.name(), LocalDate.now(), LocalDate.now().plusDays(5), BigDecimal.valueOf(42500), false);
    }
}
