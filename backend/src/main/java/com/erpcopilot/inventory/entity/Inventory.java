package com.erpcopilot.inventory.entity;

import com.erpcopilot.common.entity.BaseEntity;
import com.erpcopilot.product.entity.Product;
import com.erpcopilot.warehouse.entity.Warehouse;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Inventory entity tracking stock levels per product per warehouse.
 */
@Entity
@Table(name = "inventory", uniqueConstraints = {
        @UniqueConstraint(name = "uk_inventory_product_warehouse",
                columnNames = {"product_id", "warehouse_id"})
}, indexes = {
        @Index(name = "idx_inventory_product", columnList = "product_id"),
        @Index(name = "idx_inventory_warehouse", columnList = "warehouse_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Inventory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantityOnHand = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantityReserved = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantityOnOrder = 0;

    private Instant lastMovementAt;

    @Column(length = 50)
    private String zone;  // Warehouse zone (A1, B2, etc.)

    @Column(length = 50)
    private String binLocation;

    public int getAvailableQuantity() {
        return quantityOnHand - quantityReserved;
    }

    public boolean isLowStock() {
        return quantityOnHand <= product.getReorderLevel();
    }

    public boolean isDeadStock() {
        if (lastMovementAt == null) return quantityOnHand > 0;
        return quantityOnHand > 0 &&
               lastMovementAt.isBefore(Instant.now().minusSeconds(90L * 24 * 3600));
    }
}
