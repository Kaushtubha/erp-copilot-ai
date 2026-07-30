package com.erpcopilot.purchase.entity;

import com.erpcopilot.common.entity.BaseEntity;
import com.erpcopilot.vendor.entity.Vendor;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Purchase Order entity with full lifecycle management.
 */
@Entity
@Table(name = "purchase_orders", indexes = {
        @Index(name = "idx_po_vendor", columnList = "vendor_id"),
        @Index(name = "idx_po_status", columnList = "status"),
        @Index(name = "idx_po_order_date", columnList = "order_date")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PurchaseOrder extends BaseEntity {

    @Column(nullable = false, unique = true, length = 30)
    private String poNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private Status status = Status.DRAFT;

    @Column(nullable = false)
    private LocalDate orderDate;

    @Column(nullable = false)
    private LocalDate expectedDeliveryDate;

    private LocalDate actualDeliveryDate;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(length = 100)
    private String approvedBy;

    private LocalDate approvedAt;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PurchaseOrderItem> items = new ArrayList<>();

    public boolean isDelayed() {
        return status != Status.RECEIVED && status != Status.CANCELLED &&
               LocalDate.now().isAfter(expectedDeliveryDate);
    }

    public int getDaysDelayed() {
        if (!isDelayed()) return 0;
        return (int) java.time.temporal.ChronoUnit.DAYS.between(expectedDeliveryDate, LocalDate.now());
    }

    public enum Status {
        DRAFT, PENDING_APPROVAL, APPROVED, SENT_TO_VENDOR,
        PARTIALLY_RECEIVED, RECEIVED, CANCELLED, ON_HOLD
    }
}
