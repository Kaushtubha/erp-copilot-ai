package com.erpcopilot.product.entity;

import com.erpcopilot.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Product entity representing items in the product catalog.
 */
@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_products_sku", columnList = "sku", unique = true),
        @Index(name = "idx_products_category", columnList = "category")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String category;

    @Column(length = 50)
    private String unit;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer reorderLevel = 10;

    @Column(nullable = false)
    private Integer reorderQuantity = 50;

    @Column(length = 100)
    private String brand;

    @Column(length = 50)
    private String hsCode;

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private boolean autoReorder = false;
}
