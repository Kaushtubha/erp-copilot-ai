package com.erpcopilot.vendor.entity;

import com.erpcopilot.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Vendor entity with performance scoring for risk analysis.
 */
@Entity
@Table(name = "vendors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vendor extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 100)
    private String contactPerson;

    @Column(length = 255)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 50)
    private String gstin;

    @Column(length = 50)
    private String panNumber;

    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.valueOf(3.0);

    @Column(nullable = false)
    @Builder.Default
    private Integer leadTimeDays = 7;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal onTimeDeliveryRate = BigDecimal.valueOf(85.0);  // percentage

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal qualityRejectionRate = BigDecimal.valueOf(2.0);  // percentage

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal totalPurchaseValue = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private RiskLevel riskLevel = RiskLevel.LOW;

    @Builder.Default
    private boolean active = true;

    public enum RiskLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    /**
     * Computes vendor risk score (0-100, higher = riskier).
     */
    public int computeRiskScore() {
        int score = 0;
        if (onTimeDeliveryRate.doubleValue() < 70) score += 40;
        else if (onTimeDeliveryRate.doubleValue() < 85) score += 20;

        if (qualityRejectionRate.doubleValue() > 10) score += 40;
        else if (qualityRejectionRate.doubleValue() > 5) score += 20;

        if (rating.doubleValue() < 2.5) score += 20;
        else if (rating.doubleValue() < 3.5) score += 10;

        return Math.min(score, 100);
    }
}
