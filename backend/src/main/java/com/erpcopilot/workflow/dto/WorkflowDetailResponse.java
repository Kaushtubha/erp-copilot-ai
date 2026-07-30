package com.erpcopilot.workflow.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record WorkflowDetailResponse(
        UUID id,
        String name,
        String description,
        String triggerType,
        Map<String, Object> triggerConfig,
        Map<String, Object> conditions,
        Map<String, Object> steps,
        boolean isActive,
        String createdBy,
        String naturalLanguageInput,
        Integer executionCount,
        Integer successCount,
        List<WorkflowExecutionResponse> recentExecutions,
        Instant createdAt
) {}
