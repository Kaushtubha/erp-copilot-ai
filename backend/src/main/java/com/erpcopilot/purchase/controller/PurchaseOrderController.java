package com.erpcopilot.purchase.controller;

import com.erpcopilot.purchase.dto.*;
import com.erpcopilot.purchase.entity.PurchaseOrder;
import com.erpcopilot.purchase.service.PurchaseOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Purchase Order REST controller with full CRUD and lifecycle management.
 */
@RestController
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
@Tag(name = "Purchase Orders", description = "Purchase order management")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    @GetMapping
    @Operation(summary = "List purchase orders with filters")
    public ResponseEntity<Page<PurchaseOrderResponse>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String vendorId,
            @RequestParam(required = false) Boolean delayed,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(purchaseOrderService.findAll(status, vendorId, delayed, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderDetailResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(purchaseOrderService.findById(id));
    }

    @GetMapping("/delayed")
    @Operation(summary = "Get all delayed purchase orders")
    public ResponseEntity<List<PurchaseOrderResponse>> getDelayed() {
        return ResponseEntity.ok(purchaseOrderService.getDelayedOrders());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PURCHASE_MANAGER')")
    @Operation(summary = "Create a new purchase order")
    public ResponseEntity<PurchaseOrderDetailResponse> create(@Valid @RequestBody CreatePurchaseOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(purchaseOrderService.create(request));
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'PURCHASE_MANAGER')")
    @Operation(summary = "Approve a pending purchase order")
    public ResponseEntity<PurchaseOrderResponse> approve(@PathVariable UUID id) {
        return ResponseEntity.ok(purchaseOrderService.approve(id));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'PURCHASE_MANAGER')")
    public ResponseEntity<PurchaseOrderResponse> cancel(@PathVariable UUID id) {
        return ResponseEntity.ok(purchaseOrderService.cancel(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'PURCHASE_MANAGER')")
    public ResponseEntity<PurchaseOrderResponse> updateStatus(
            @PathVariable UUID id,
            @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(purchaseOrderService.updateStatus(id, PurchaseOrder.Status.valueOf(request.status())));
    }
}
