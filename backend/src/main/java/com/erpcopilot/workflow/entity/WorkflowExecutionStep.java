package com.erpcopilot.workflow.entity;

import com.erpcopilot.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "workflow_execution_steps")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WorkflowExecutionStep extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "execution_id", nullable = false)
    private WorkflowExecution execution;

    @Column(nullable = false)
    private Integer stepIndex;

    @Column(nullable = false, length = 100)
    private String stepName;

    @Column(length = 50)
    private String actionType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> input;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> output;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private Instant executedAt;

    public enum Status { PENDING, RUNNING, SUCCESS, FAILED, SKIPPED }
}
