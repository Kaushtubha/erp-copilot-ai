package com.erpcopilot.workflow.service;

import com.erpcopilot.workflow.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@Service
public class WorkflowService {

    public Page<WorkflowResponse> findAll(Boolean active, String triggerType, Pageable pageable) {
        return new PageImpl<>(Collections.emptyList(), pageable, 0);
    }

    public WorkflowDetailResponse findById(UUID id) {
        return new WorkflowDetailResponse(id, "Auto Reorder", "Sample workflow", "THRESHOLD", Map.of(), Map.of(), Map.of(), true, "admin@erp.com", "Natural input", 10, 10, Collections.emptyList(), Instant.now());
    }

    public WorkflowResponse create(CreateWorkflowRequest request) {
        return new WorkflowResponse(UUID.randomUUID(), request.name(), request.description(), request.triggerType(), request.triggerConfig(), false, "system", 0, 0, Instant.now());
    }

    public WorkflowResponse setActive(UUID id, boolean active) {
        return new WorkflowResponse(id, "Auto Reorder", "Sample workflow", "THRESHOLD", Map.of(), active, "admin@erp.com", 10, 10, Instant.now());
    }

    public WorkflowExecutionResponse triggerManually(UUID id) {
        return new WorkflowExecutionResponse(UUID.randomUUID(), id, "manual", "SUCCESS", Instant.now(), Instant.now(), null);
    }

    public Page<WorkflowExecutionResponse> getExecutions(UUID id, Pageable pageable) {
        return new PageImpl<>(Collections.emptyList(), pageable, 0);
    }

    public void delete(UUID id) {}

    public WorkflowPreviewResponse parseFromNaturalLanguage(String description) {
        return new WorkflowPreviewResponse("Parsed Workflow", description, "THRESHOLD", Map.of(), Map.of(), Map.of(), 0.9, "Parsed successfully", Collections.emptyList());
    }
}
