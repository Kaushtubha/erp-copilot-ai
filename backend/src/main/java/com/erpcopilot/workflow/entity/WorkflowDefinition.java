package com.erpcopilot.workflow.entity;

import com.erpcopilot.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

/**
 * Workflow Definition — stores a reusable automated workflow created via natural language.
 *
 * <p>A workflow consists of:
 * <ul>
 *   <li>trigger: what starts the workflow (event, schedule, threshold)</li>
 *   <li>conditions: AND/OR guards evaluated before actions run</li>
 *   <li>steps: ordered list of actions to execute</li>
 * </ul>
 */
@Entity
@Table(name = "workflow_definitions", indexes = {
        @Index(name = "idx_workflow_active", columnList = "is_active"),
        @Index(name = "idx_workflow_trigger_type", columnList = "trigger_type")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkflowDefinition extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TriggerType triggerType;

    /** JSONB: trigger configuration (e.g., threshold value, cron expression, event type) */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> triggerConfig;

    /** JSONB: AND/OR condition tree */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> conditions;

    /** JSONB: ordered list of action steps */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> steps;

    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = false;

    @Column(length = 255)
    private String createdBy;

    /** Original natural language description from the user */
    @Column(columnDefinition = "TEXT")
    private String naturalLanguageInput;

    /** Number of times this workflow has run */
    @Builder.Default
    private Integer executionCount = 0;

    /** Number of successful executions */
    @Builder.Default
    private Integer successCount = 0;

    public enum TriggerType {
        EVENT,       // Triggered by ERP events (stock_low, po_created, grn_received)
        SCHEDULE,    // Cron-based schedule
        THRESHOLD,   // Value-based threshold (quantity < N)
        MANUAL       // Manual trigger via API
    }
}
