package com.erpcopilot.workflow.dto;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record WorkflowExecutionResponse(
        UUID id,
        UUID workflowDefinitionId,
        String triggeredBy,
        String status,
        Instant startedAt,
        Instant completedAt,
        String errorMessage
) {}
