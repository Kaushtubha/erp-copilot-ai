"""
Inventory Agent — Answers inventory-related queries using Hybrid RAG + ERP API.
"""
import json
import httpx
from langchain_core.messages import SystemMessage, HumanMessage
from models.schemas import AgentState
from prompts.prompt_templates import INVENTORY_AGENT_PROMPT
from .base_agent import BaseAgent


class InventoryAgent(BaseAgent):
    """
    Handles all inventory queries:
    - Stock levels per product/warehouse
    - Low stock alerts
    - Dead stock identification
    - Inventory adjustment explanations
    """

    async def run(self, state: AgentState) -> dict:
        llm = self.get_llm()

        # Fetch relevant inventory data from Spring Boot API
        inventory_context = await self._fetch_inventory_context(state)

        messages = [
            SystemMessage(content=INVENTORY_AGENT_PROMPT),
            HumanMessage(content=f"""
User Query: {state['query']}
User Role: {state['user_role']}
Entities: {json.dumps(state.get('entities', {}), indent=2)}

Current Inventory Data:
{json.dumps(inventory_context, indent=2)}

RAG Context:
{json.dumps(state.get('context', []), indent=2)}

Provide a detailed, actionable answer. Include specific numbers, product names, and recommendations.
If the data shows critical issues (very low stock, many delays), highlight them prominently.
""")
        ]

        response = await llm.ainvoke(messages)

        # Generate chart data if appropriate
        chart_data = self._build_chart_data(inventory_context, state)

        return {
            **state,
            "response": response.content,
            "chart_data": chart_data,
            "citations": [f"Inventory data retrieved from ERP system at {inventory_context.get('timestamp', 'now')}"],
        }

    async def _fetch_inventory_context(self, state: AgentState) -> dict:
        """Fetch inventory data from Spring Boot API."""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                params = {}
                entities = state.get("entities", {})

                if "warehouse" in entities:
                    params["warehouseId"] = entities["warehouse"]
                if "category" in entities:
                    params["category"] = entities["category"]
                if state.get("intent") in ["inventory_alert", "low_stock"]:
                    params["lowStock"] = True

                response = await client.get(
                    f"{self.settings.backend_base_url}/api/inventory",
                    params=params,
                )
                data = response.json() if response.status_code == 200 else {}

                # Also get summary KPIs
                summary_resp = await client.get(
                    f"{self.settings.backend_base_url}/api/inventory/summary"
                )
                summary = summary_resp.json() if summary_resp.status_code == 200 else {}

                return {"inventory": data, "summary": summary, "timestamp": "now"}
        except Exception as e:
            return {"error": str(e), "inventory": [], "summary": {}}

    def _build_chart_data(self, context: dict, state: AgentState) -> dict | None:
        """Build Recharts-compatible chart data for inventory visualization."""
        summary = context.get("summary", {})
        if not summary:
            return None

        return {
            "type": "bar",
            "title": "Inventory Overview",
            "data": [
                {"name": "Total SKUs", "value": summary.get("totalSkus", 0)},
                {"name": "Low Stock Items", "value": summary.get("lowStockCount", 0), "color": "#ef4444"},
                {"name": "Dead Stock Items", "value": summary.get("deadStockCount", 0), "color": "#f97316"},
                {"name": "Healthy Stock", "value": summary.get("healthyStockCount", 0), "color": "#22c55e"},
            ]
        }
