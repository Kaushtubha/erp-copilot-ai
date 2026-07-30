package com.erpcopilot.purchase.entity;

import com.erpcopilot.common.entity.BaseEntity;
import com.erpcopilot.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PurchaseOrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer orderedQuantity;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Builder.Default
    private Integer receivedQuantity = 0;

    public BigDecimal getTotalPrice() {
        return unitPrice.multiply(BigDecimal.valueOf(orderedQuantity));
    }
}
