package com.erpcopilot.workflow.controller;

import com.erpcopilot.workflow.dto.*;
import com.erpcopilot.workflow.service.WorkflowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Workflow Automation REST Controller.
 * Supports CRUD and execution management for AI-generated workflows.
 */
@RestController
@RequestMapping("/api/workflows")
@RequiredArgsConstructor
@Tag(name = "Workflow Automation", description = "Manage and execute automated ERP workflows")
public class WorkflowController {

    private final WorkflowService workflowService;

    @GetMapping
    @Operation(summary = "List all workflows")
    public ResponseEntity<Page<WorkflowResponse>> listAll(
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String triggerType,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(workflowService.findAll(active, triggerType, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get workflow details with execution history")
    public ResponseEntity<WorkflowDetailResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(workflowService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Create workflow from natural language description")
    public ResponseEntity<WorkflowResponse> create(@Valid @RequestBody CreateWorkflowRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workflowService.create(request));
    }

    @PatchMapping("/{id}/enable")
    @Operation(summary = "Enable a workflow")
    public ResponseEntity<WorkflowResponse> enable(@PathVariable UUID id) {
        return ResponseEntity.ok(workflowService.setActive(id, true));
    }

    @PatchMapping("/{id}/disable")
    @Operation(summary = "Disable a workflow")
    public ResponseEntity<WorkflowResponse> disable(@PathVariable UUID id) {
        return ResponseEntity.ok(workflowService.setActive(id, false));
    }

    @PostMapping("/{id}/run")
    @Operation(summary = "Manually trigger a workflow execution")
    public ResponseEntity<WorkflowExecutionResponse> runManually(@PathVariable UUID id) {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(workflowService.triggerManually(id));
    }

    @GetMapping("/{id}/executions")
    @Operation(summary = "Get execution history for a workflow")
    public ResponseEntity<Page<WorkflowExecutionResponse>> getExecutions(
            @PathVariable UUID id,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(workflowService.getExecutions(id, pageable));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        workflowService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/parse")
    @Operation(summary = "Parse natural language to workflow definition (preview before saving)")
    public ResponseEntity<WorkflowPreviewResponse> parseNaturalLanguage(
            @RequestBody NaturalLanguageWorkflowRequest request) {
        return ResponseEntity.ok(workflowService.parseFromNaturalLanguage(request.description()));
    }
}
