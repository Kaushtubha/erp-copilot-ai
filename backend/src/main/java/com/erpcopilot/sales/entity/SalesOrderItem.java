package com.erpcopilot.sales.entity;

import com.erpcopilot.common.entity.BaseEntity;
import com.erpcopilot.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "sales_order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalesOrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_order_id", nullable = false)
    private SalesOrder salesOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal discountPercent = BigDecimal.ZERO;

    public BigDecimal getLineTotal() {
        BigDecimal base = unitPrice.multiply(BigDecimal.valueOf(quantity));
        BigDecimal discount = base.multiply(discountPercent).divide(BigDecimal.valueOf(100));
        return base.subtract(discount);
    }
}
