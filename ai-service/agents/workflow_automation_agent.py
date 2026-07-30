"""
Workflow Automation Agent — Converts natural language into structured ERP workflows.

This is the most sophisticated agent in the system.
It uses LLM function calling to parse NL descriptions into executable workflow definitions,
then communicates with the Spring Boot backend to persist and manage them.
"""
import json
import httpx
from langchain_core.messages import SystemMessage, HumanMessage
from models.schemas import AgentState, WorkflowDefinitionSchema
from prompts.workflow_prompts import WORKFLOW_PARSER_PROMPT, WORKFLOW_EXAMPLES
from .base_agent import BaseAgent


WORKFLOW_PARSE_FUNCTION = {
    "name": "create_workflow_definition",
    "description": "Parse a natural language workflow description into a structured workflow definition",
    "parameters": {
        "type": "object",
        "properties": {
            "name": {"type": "string", "description": "Short, descriptive workflow name"},
            "description": {"type": "string", "description": "What this workflow does"},
            "trigger_type": {
                "type": "string",
                "enum": ["EVENT", "SCHEDULE", "THRESHOLD", "MANUAL"],
                "description": "What triggers this workflow"
            },
            "trigger_config": {
                "type": "object",
                "description": "Trigger configuration. For SCHEDULE: {cron: '0 9 * * *'}. For THRESHOLD: {field: 'inventory.quantity_on_hand', operator: 'less_than', value: 'reorder_level'}. For EVENT: {event_type: 'PO_CREATED|GRN_RECEIVED|STOCK_LOW|SO_CONFIRMED'}"
            },
            "conditions": {
                "type": "object",
                "description": "AND/OR condition tree to guard execution. Optional."
            },
            "steps": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "index": {"type": "integer"},
                        "name": {"type": "string"},
                        "action": {
                            "type": "string",
                            "enum": [
                                "CREATE_PURCHASE_ORDER",
                                "SEND_NOTIFICATION",
                                "ESCALATE_APPROVAL",
                                "GENERATE_REPORT",
                                "UPDATE_INVENTORY",
                                "UPDATE_PO_STATUS",
                                "UPDATE_GRN_STATUS",
                                "SEND_EMAIL",
                                "CALL_WEBHOOK",
                                "AUDIT_LOG",
                                "WAIT_FOR_APPROVAL"
                            ]
                        },
                        "params": {"type": "object"},
                        "requires_approval": {"type": "boolean", "default": False},
                        "approver_role": {"type": "string"}
                    },
                    "required": ["index", "name", "action", "params"]
                }
            },
            "confidence": {
                "type": "number",
                "description": "Confidence 0-1 in the parsed workflow"
            },
            "explanation": {
                "type": "string",
                "description": "Human-readable explanation of what was parsed"
            },
            "warnings": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Any ambiguities or assumptions made"
            }
        },
        "required": ["name", "description", "trigger_type", "trigger_config", "steps", "confidence", "explanation"]
    }
}


class WorkflowAutomationAgent(BaseAgent):
    """
    Workflow Automation Agent.

    Capabilities:
    - Parse natural language → WorkflowDefinition via function calling
    - Preview workflow before saving (human-in-the-loop)
    - Save workflow to Spring Boot backend
    - Query existing workflows
    - Trigger manual workflow execution
    """

    async def run(self, state: AgentState) -> dict:
        intent = state.get("intent", "workflow_query")

        if intent == "workflow_create":
            return await self._create_workflow(state)
        elif intent == "workflow_query":
            return await self._query_workflows(state)
        elif intent == "workflow_trigger":
            return await self._trigger_workflow(state)
        else:
            return await self._create_workflow(state)

    async def _create_workflow(self, state: AgentState) -> dict:
        """Parse NL description and create a workflow."""
        llm = self.get_llm(temperature=0.05)
        llm_with_tools = llm.bind_tools([WORKFLOW_PARSE_FUNCTION])

        messages = [
            SystemMessage(content=WORKFLOW_PARSER_PROMPT),
            HumanMessage(content=f"""
User Role: {state['user_role']}
Natural Language Description: {state['query']}

Examples for reference:
{WORKFLOW_EXAMPLES}

Parse this into a structured workflow definition. Be precise about:
- Trigger type and configuration
- Conditions that must be met
- Each action step in order
- Whether any steps need human approval (especially for high-value actions)
""")
        ]

        response = await llm_with_tools.ainvoke(messages)

        workflow_def = {}
        if response.tool_calls:
            workflow_def = response.tool_calls[0]["args"]
        else:
            return {
                **state,
                "response": "I couldn't parse a workflow from your description. Please try being more specific about what should trigger the workflow and what actions should happen.",
                "error": "Failed to parse workflow definition"
            }

        confidence = workflow_def.get("confidence", 0)
        explanation = workflow_def.get("explanation", "")
        warnings = workflow_def.get("warnings", [])

        # Build human-readable preview
        response_text = self._format_workflow_preview(workflow_def, confidence, warnings)

        # Store the workflow definition in state for frontend to display
        return {
            **state,
            "response": response_text,
            "workflow_definition": workflow_def,
            "citations": ["Workflow parsed using AI. Review and confirm to save."],
        }

    async def _query_workflows(self, state: AgentState) -> dict:
        """Query existing workflows from the backend."""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    f"{self.settings.backend_base_url}/api/workflows"
                )
                workflows = resp.json() if resp.status_code == 200 else {"content": []}

            llm = self.get_llm()
            messages = [
                SystemMessage(content="You are an ERP assistant. Summarize the workflows."),
                HumanMessage(content=f"""
User Query: {state['query']}
Existing Workflows: {json.dumps(workflows, indent=2)}

Provide a clear summary of the relevant workflows.
""")
            ]
            response = await llm.ainvoke(messages)
            return {**state, "response": response.content}
        except Exception as e:
            return {**state, "response": f"Error fetching workflows: {e}", "error": str(e)}

    async def _trigger_workflow(self, state: AgentState) -> dict:
        """Trigger a manual workflow execution."""
        entities = state.get("entities", {})
        workflow_name = entities.get("workflow_name", "")

        return {
            **state,
            "response": f"To trigger workflow '{workflow_name}', please use the Workflows page in the dashboard or provide the exact workflow ID.",
        }

    def _format_workflow_preview(self, workflow: dict, confidence: float, warnings: list) -> str:
        """Format workflow definition as human-readable preview."""
        steps = workflow.get("steps", [])
        steps_text = "\n".join([
            f"  {s['index']}. **{s['name']}** ({s['action']})"
            + (f" ⚠️ Requires {s.get('approver_role', 'ADMIN')} approval" if s.get('requires_approval') else "")
            for s in steps
        ])

        trigger_config = json.dumps(workflow.get("trigger_config", {}), indent=2)

        warning_text = ""
        if warnings:
            warning_text = "\n\n⚠️ **Assumptions made:**\n" + "\n".join(f"- {w}" for w in warnings)

        confidence_emoji = "🟢" if confidence > 0.8 else "🟡" if confidence > 0.6 else "🔴"

        return f"""✅ **Workflow Parsed Successfully** {confidence_emoji} (Confidence: {confidence:.0%})

**Name:** {workflow.get('name')}
**Description:** {workflow.get('description')}

**Trigger:** `{workflow.get('trigger_type')}`
```json
{trigger_config}
```

**Steps:**
{steps_text}{warning_text}

---
💡 *This is a preview. Click **"Save Workflow"** in the panel to activate it, or say "cancel" to discard.*
"""
