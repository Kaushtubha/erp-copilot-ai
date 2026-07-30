package com.erpcopilot.workflow.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record CreateWorkflowRequest(
        @NotBlank String name,
        String description,
        @NotBlank String triggerType,
        Map<String, Object> triggerConfig,
        Map<String, Object> conditions,
        Map<String, Object> steps,
        String naturalLanguageInput
) {}
