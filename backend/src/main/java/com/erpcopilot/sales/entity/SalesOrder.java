package com.erpcopilot.sales.entity;

import com.erpcopilot.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Sales Order entity.
 */
@Entity
@Table(name = "sales_orders", indexes = {
        @Index(name = "idx_so_status", columnList = "status"),
        @Index(name = "idx_so_order_date", columnList = "order_date"),
        @Index(name = "idx_so_customer", columnList = "customer_name")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalesOrder extends BaseEntity {

    @Column(nullable = false, unique = true, length = 30)
    private String soNumber;

    @Column(nullable = false, length = 200)
    private String customerName;

    @Column(length = 255)
    private String customerEmail;

    @Column(length = 20)
    private String customerPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private Status status = Status.DRAFT;

    @Column(nullable = false)
    private LocalDate orderDate;

    private LocalDate expectedDeliveryDate;
    private LocalDate actualDeliveryDate;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String shippingAddress;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "salesOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SalesOrderItem> items = new ArrayList<>();

    public enum Status {
        DRAFT, CONFIRMED, PROCESSING, PACKED, SHIPPED, DELIVERED, CANCELLED, RETURNED
    }
}
