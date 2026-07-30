package com.erpcopilot.grn.entity;

import com.erpcopilot.common.entity.BaseEntity;
import com.erpcopilot.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "grn_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GRNItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grn_id", nullable = false)
    private GRN grn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer orderedQuantity;

    @Column(nullable = false)
    @Builder.Default
    private Integer receivedQuantity = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer acceptedQuantity = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer rejectedQuantity = 0;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    public int getShortage() {
        return orderedQuantity - receivedQuantity;
    }
}
