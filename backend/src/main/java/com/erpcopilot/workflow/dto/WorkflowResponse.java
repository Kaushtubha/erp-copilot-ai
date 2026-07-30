package com.erpcopilot.workflow.dto;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record WorkflowResponse(
        UUID id,
        String name,
        String description,
        String triggerType,
        Map<String, Object> triggerConfig,
        boolean isActive,
        String createdBy,
        Integer executionCount,
        Integer successCount,
        Instant createdAt
) {}
