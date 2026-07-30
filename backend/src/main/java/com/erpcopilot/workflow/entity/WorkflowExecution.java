package com.erpcopilot.workflow.entity;

import com.erpcopilot.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Tracks a single execution run of a WorkflowDefinition.
 */
@Entity
@Table(name = "workflow_executions", indexes = {
        @Index(name = "idx_we_workflow", columnList = "workflow_definition_id"),
        @Index(name = "idx_we_status", columnList = "status")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkflowExecution extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_definition_id", nullable = false)
    private WorkflowDefinition workflowDefinition;

    @Column(length = 100)
    private String triggeredBy;  // user email or "system"

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> triggerPayload;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.PENDING;

    private Instant startedAt;
    private Instant completedAt;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @OneToMany(mappedBy = "execution", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkflowExecutionStep> steps = new ArrayList<>();

    public enum Status {
        PENDING, RUNNING, WAITING_APPROVAL, SUCCESS, FAILED, CANCELLED
    }
}
