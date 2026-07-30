"""
Planner Agent — Classifies user intent and routes to the appropriate domain agent.

Uses Gemini function calling to produce structured routing decisions.
"""
import json
from langchain_core.messages import SystemMessage, HumanMessage
from models.schemas import AgentState
from prompts.prompt_templates import PLANNER_SYSTEM_PROMPT
from .base_agent import BaseAgent


ROUTING_FUNCTION = {
    "name": "route_query",
    "description": "Classify the user's ERP query and determine which agent should handle it",
    "parameters": {
        "type": "object",
        "properties": {
            "intent": {
                "type": "string",
                "description": "The classified intent of the query",
                "enum": [
                    "inventory_query", "inventory_alert", "inventory_adjustment",
                    "warehouse_query", "warehouse_capacity", "dead_stock",
                    "sales_query", "sales_analytics", "sales_forecast",
                    "purchase_query", "purchase_create", "purchase_status",
                    "grn_query", "grn_create",
                    "vendor_query", "vendor_risk",
                    "analytics_query", "kpi_dashboard",
                    "forecast_query", "demand_prediction",
                    "report_generate", "pdf_export",
                    "sql_query",
                    "chart_request",
                    "workflow_create", "workflow_query", "workflow_trigger",
                    "erp_explanation", "general_query"
                ]
            },
            "target_agent": {
                "type": "string",
                "enum": [
                    "inventory_agent", "warehouse_agent", "sales_agent",
                    "purchase_agent", "analytics_agent", "forecast_agent",
                    "report_agent", "sql_agent", "chart_agent",
                    "explanation_agent", "workflow_agent"
                ]
            },
            "entities": {
                "type": "object",
                "description": "Extracted entities from the query (product names, dates, SKUs, etc.)"
            },
            "confidence": {
                "type": "number",
                "description": "Confidence score 0-1"
            }
        },
        "required": ["intent", "target_agent", "entities", "confidence"]
    }
}

INTENT_TO_AGENT = {
    "inventory_query": "inventory_agent",
    "inventory_alert": "inventory_agent",
    "inventory_adjustment": "inventory_agent",
    "warehouse_query": "warehouse_agent",
    "warehouse_capacity": "warehouse_agent",
    "dead_stock": "warehouse_agent",
    "sales_query": "sales_agent",
    "sales_analytics": "sales_agent",
    "sales_forecast": "forecast_agent",
    "purchase_query": "purchase_agent",
    "purchase_create": "purchase_agent",
    "purchase_status": "purchase_agent",
    "grn_query": "purchase_agent",
    "grn_create": "purchase_agent",
    "vendor_query": "purchase_agent",
    "vendor_risk": "purchase_agent",
    "analytics_query": "analytics_agent",
    "kpi_dashboard": "analytics_agent",
    "forecast_query": "forecast_agent",
    "demand_prediction": "forecast_agent",
    "report_generate": "report_agent",
    "pdf_export": "report_agent",
    "sql_query": "sql_agent",
    "chart_request": "chart_agent",
    "workflow_create": "workflow_agent",
    "workflow_query": "workflow_agent",
    "workflow_trigger": "workflow_agent",
    "erp_explanation": "explanation_agent",
    "general_query": "explanation_agent",
}


class PlannerAgent(BaseAgent):
    """
    Planner agent that classifies user intent and routes to domain agents.
    Uses structured function calling for deterministic routing.
    """

    async def run(self, state: AgentState) -> dict:
        llm = self.get_llm()

        # Build messages with conversation context
        messages = [
            SystemMessage(content=PLANNER_SYSTEM_PROMPT),
            HumanMessage(content=f"""
User Role: {state['user_role']}
Query: {state['query']}

Previous context: {json.dumps(state.get('conversation_history', [])[-3:], indent=2) if state.get('conversation_history') else 'None'}

Classify this query and route to the appropriate agent.
""")
        ]

        # Use function calling for structured output
        llm_with_tools = llm.bind_tools([ROUTING_FUNCTION])
        response = await llm_with_tools.ainvoke(messages)

        # Parse the routing decision
        routing = {}
        if response.tool_calls:
            routing = response.tool_calls[0]["args"]
        else:
            # Fallback: parse from text
            routing = {
                "intent": "general_query",
                "target_agent": "explanation_agent",
                "entities": {},
                "confidence": 0.5
            }

        return {
            **state,
            "target_agent": routing.get("target_agent", "explanation_agent"),
            "intent": routing.get("intent", "general_query"),
            "entities": routing.get("entities", {}),
        }
