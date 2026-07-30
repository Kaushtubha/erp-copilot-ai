package com.erpcopilot.warehouse.entity;

import com.erpcopilot.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Warehouse entity representing physical storage locations.
 */
@Entity
@Table(name = "warehouses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Warehouse extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 200)
    private String location;

    @Column(length = 50)
    private String city;

    @Column(length = 50)
    private String state;

    @Column(nullable = false)
    private Integer totalCapacity;  // in cubic meters or units

    @Column(nullable = false)
    @Builder.Default
    private Integer usedCapacity = 0;

    @Column(length = 20)
    private String contactPhone;

    @Column(length = 100)
    private String managerName;

    @Builder.Default
    private boolean active = true;

    public double getCapacityUtilizationPercent() {
        if (totalCapacity == 0) return 0;
        return (double) usedCapacity / totalCapacity * 100;
    }
}
