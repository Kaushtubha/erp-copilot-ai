package com.erpcopilot.workflow.dto;

import java.util.List;
import java.util.Map;

public record WorkflowPreviewResponse(
        String name,
        String description,
        String triggerType,
        Map<String, Object> triggerConfig,
        Map<String, Object> conditions,
        Map<String, Object> steps,
        double confidence,
        String explanation,
        List<String> warnings
) {}
