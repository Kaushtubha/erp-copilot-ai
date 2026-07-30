package com.erpcopilot.grn.entity;

import com.erpcopilot.common.entity.BaseEntity;
import com.erpcopilot.purchase.entity.PurchaseOrder;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Goods Receipt Note entity.
 */
@Entity
@Table(name = "grns", indexes = {
        @Index(name = "idx_grn_po", columnList = "purchase_order_id"),
        @Index(name = "idx_grn_status", columnList = "status")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GRN extends BaseEntity {

    @Column(nullable = false, unique = true, length = 30)
    private String grnNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @Column(nullable = false)
    private LocalDate receivedDate;

    @Column(length = 100)
    private String receivedBy;

    @Column(length = 100)
    private String inspectedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private Status status = Status.PENDING_INSPECTION;

    @Column(columnDefinition = "TEXT")
    private String qualityNotes;

    @OneToMany(mappedBy = "grn", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GRNItem> items = new ArrayList<>();

    public enum Status {
        PENDING_INSPECTION, UNDER_INSPECTION, ACCEPTED, PARTIALLY_ACCEPTED, REJECTED, CLOSED
    }
}
