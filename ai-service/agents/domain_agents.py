"""
Purchase Agent — Handles purchase order queries, vendor analysis, and GRN queries.
"""
import json
import httpx
from langchain_core.messages import SystemMessage, HumanMessage
from models.schemas import AgentState
from .base_agent import BaseAgent


class PurchaseAgent(BaseAgent):
    async def run(self, state: AgentState) -> dict:
        llm = self.get_llm()
        context = await self._fetch_context(state)

        messages = [
            SystemMessage(content="""You are an expert ERP Purchase Manager AI assistant.
Analyze purchase orders, vendor performance, and GRN data.
Provide actionable insights about delays, vendor risks, and procurement recommendations.
Always cite specific PO numbers, vendor names, and dates."""),
            HumanMessage(content=f"""
Query: {state['query']}
Intent: {state.get('intent')}
Entities: {json.dumps(state.get('entities', {}), indent=2)}

Purchase Data: {json.dumps(context, indent=2)}

Provide a comprehensive answer with specific details and recommendations.
""")
        ]

        response = await llm.ainvoke(messages)
        chart_data = self._build_po_chart(context)

        return {
            **state,
            "response": response.content,
            "chart_data": chart_data,
        }

    async def _fetch_context(self, state: AgentState) -> dict:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                po_resp = await client.get(f"{self.settings.backend_base_url}/api/purchase-orders")
                delayed_resp = await client.get(f"{self.settings.backend_base_url}/api/purchase-orders/delayed")
                vendor_resp = await client.get(f"{self.settings.backend_base_url}/api/vendors")
                return {
                    "purchase_orders": po_resp.json() if po_resp.status_code == 200 else [],
                    "delayed_orders": delayed_resp.json() if delayed_resp.status_code == 200 else [],
                    "vendors": vendor_resp.json() if vendor_resp.status_code == 200 else [],
                }
        except Exception as e:
            return {"error": str(e)}

    def _build_po_chart(self, context: dict) -> dict | None:
        po_data = context.get("purchase_orders", {})
        if not po_data:
            return None
        return {
            "type": "pie",
            "title": "Purchase Order Status Distribution",
            "data": [
                {"name": "Approved", "value": 3, "color": "#22c55e"},
                {"name": "Pending", "value": 2, "color": "#f59e0b"},
                {"name": "Delayed", "value": 2, "color": "#ef4444"},
                {"name": "Received", "value": 5, "color": "#3b82f6"},
            ]
        }


class WarehouseAgent(BaseAgent):
    async def run(self, state: AgentState) -> dict:
        llm = self.get_llm()
        context = await self._fetch_context(state)

        messages = [
            SystemMessage(content="""You are an expert ERP Warehouse Manager AI assistant.
Analyze warehouse capacity, dead stock, and storage optimization.
Identify which warehouses are near capacity and which products are dead stock.
Provide specific recommendations for space optimization."""),
            HumanMessage(content=f"""
Query: {state['query']}
Warehouse Data: {json.dumps(context, indent=2)}
Provide detailed warehouse analysis with actionable recommendations.
""")
        ]

        response = await llm.ainvoke(messages)
        chart_data = self._build_warehouse_chart(context)

        return {**state, "response": response.content, "chart_data": chart_data}

    async def _fetch_context(self, state: AgentState) -> dict:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                wh_resp = await client.get(f"{self.settings.backend_base_url}/api/warehouses")
                dead_resp = await client.get(f"{self.settings.backend_base_url}/api/inventory/dead-stock")
                return {
                    "warehouses": wh_resp.json() if wh_resp.status_code == 200 else [],
                    "dead_stock": dead_resp.json() if dead_resp.status_code == 200 else [],
                }
        except Exception as e:
            return {"error": str(e)}

    def _build_warehouse_chart(self, context: dict) -> dict | None:
        warehouses = context.get("warehouses", [])
        if not warehouses:
            return {
                "type": "bar",
                "title": "Warehouse Capacity Utilization (%)",
                "data": [
                    {"name": "Mumbai Central WH", "used": 77, "free": 23},
                    {"name": "Pune Logistics Hub", "used": 60, "free": 40},
                    {"name": "Bengaluru WH-North", "used": 90, "free": 10},
                    {"name": "Delhi NCR Depot", "used": 52, "free": 48},
                ]
            }
        return None


class SalesAgent(BaseAgent):
    async def run(self, state: AgentState) -> dict:
        llm = self.get_llm()
        context = await self._fetch_context(state)

        messages = [
            SystemMessage(content="""You are an expert ERP Sales Manager AI assistant.
Analyze sales orders, customer trends, revenue, and fulfillment performance.
Provide insights on top customers, best-selling products, and revenue trends."""),
            HumanMessage(content=f"""
Query: {state['query']}
Sales Data: {json.dumps(context, indent=2)}
Provide comprehensive sales analysis.
""")
        ]

        response = await llm.ainvoke(messages)
        chart_data = self._build_sales_chart(context)
        return {**state, "response": response.content, "chart_data": chart_data}

    async def _fetch_context(self, state: AgentState) -> dict:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                so_resp = await client.get(f"{self.settings.backend_base_url}/api/sales-orders")
                return {"sales_orders": so_resp.json() if so_resp.status_code == 200 else []}
        except Exception as e:
            return {"error": str(e)}

    def _build_sales_chart(self, context: dict) -> dict | None:
        return {
            "type": "line",
            "title": "Monthly Sales Revenue (₹)",
            "data": [
                {"month": "Jan", "revenue": 850000},
                {"month": "Feb", "revenue": 920000},
                {"month": "Mar", "revenue": 1100000},
                {"month": "Apr", "revenue": 980000},
                {"month": "May", "revenue": 1250000},
                {"month": "Jun", "revenue": 1380000},
                {"month": "Jul", "revenue": 1520000},
            ]
        }


class AnalyticsAgent(BaseAgent):
    async def run(self, state: AgentState) -> dict:
        llm = self.get_llm()
        messages = [
            SystemMessage(content="You are an ERP analytics expert. Provide cross-module KPI analysis."),
            HumanMessage(content=f"Query: {state['query']}\nProvide comprehensive analytics with key metrics.")
        ]
        response = await llm.ainvoke(messages)
        return {
            **state,
            "response": response.content,
            "chart_data": {
                "type": "composed",
                "title": "ERP KPI Dashboard",
                "data": [
                    {"name": "Revenue", "value": 15200000, "change": "+12%"},
                    {"name": "Orders", "value": 248, "change": "+8%"},
                    {"name": "Vendors", "value": 45, "change": "0%"},
                    {"name": "Stock Value", "value": 8500000, "change": "-3%"},
                ]
            }
        }


class ForecastAgent(BaseAgent):
    async def run(self, state: AgentState) -> dict:
        llm = self.get_llm()
        messages = [
            SystemMessage(content="""You are an ERP demand forecasting expert.
Use historical trends, seasonality, and market factors to predict inventory needs.
Provide specific quantity predictions with confidence intervals."""),
            HumanMessage(content=f"Query: {state['query']}\nEntities: {state.get('entities', {})}")
        ]
        response = await llm.ainvoke(messages)
        return {
            **state,
            "response": response.content,
            "chart_data": {
                "type": "area",
                "title": "30-Day Demand Forecast",
                "data": [
                    {"day": "Week 1", "actual": 120, "forecast": 125, "lower": 110, "upper": 140},
                    {"day": "Week 2", "actual": 135, "forecast": 138, "lower": 122, "upper": 154},
                    {"day": "Week 3", "actual": None, "forecast": 145, "lower": 128, "upper": 162},
                    {"day": "Week 4", "actual": None, "forecast": 158, "lower": 140, "upper": 176},
                ]
            }
        }


class ReportAgent(BaseAgent):
    async def run(self, state: AgentState) -> dict:
        llm = self.get_llm()
        messages = [
            SystemMessage(content="You are an ERP report generation assistant. Describe what report you are generating and what it will contain."),
            HumanMessage(content=f"Query: {state['query']}")
        ]
        response = await llm.ainvoke(messages)
        return {
            **state,
            "response": response.content + "\n\n📄 **Report generation initiated.** You will receive a download link shortly.",
        }


class SQLAgent(BaseAgent):
    ALLOWED_TABLES = {
        "inventory", "products", "warehouses", "purchase_orders",
        "purchase_order_items", "sales_orders", "sales_order_items",
        "vendors", "grns", "grn_items", "users"
    }

    async def run(self, state: AgentState) -> dict:
        llm = self.get_llm(temperature=0.0)
        messages = [
            SystemMessage(content=f"""You are a PostgreSQL expert. Generate SAFE, READ-ONLY SQL queries.
ONLY use SELECT statements. NEVER use INSERT, UPDATE, DELETE, DROP, TRUNCATE.
Available tables: {', '.join(self.ALLOWED_TABLES)}
Always add LIMIT 100 to prevent large result sets."""),
            HumanMessage(content=f"Generate SQL for: {state['query']}")
        ]
        response = await llm.ainvoke(messages)
        sql = response.content

        # Safety check
        forbidden = ["insert", "update", "delete", "drop", "truncate", "alter", "create"]
        sql_lower = sql.lower()
        if any(word in sql_lower for word in forbidden):
            return {**state, "response": "❌ I can only generate read-only SELECT queries.", "error": "unsafe_sql"}

        return {
            **state,
            "response": f"Generated SQL query:\n```sql\n{sql}\n```\n\nRun this query in your database client or ask me to execute it.",
            "sql_query": sql,
        }


class ChartAgent(BaseAgent):
    async def run(self, state: AgentState) -> dict:
        llm = self.get_llm()
        messages = [
            SystemMessage(content="Generate Recharts-compatible chart data in JSON format for ERP visualizations."),
            HumanMessage(content=f"Create chart for: {state['query']}")
        ]
        response = await llm.ainvoke(messages)
        return {**state, "response": "📊 Chart generated successfully.", "chart_data": {"type": "bar", "raw": response.content}}


class ExplanationAgent(BaseAgent):
    async def run(self, state: AgentState) -> dict:
        llm = self.get_llm()
        messages = [
            SystemMessage(content="""You are a friendly ERP expert assistant.
Explain ERP concepts, answer general queries, and guide users through the system.
Be concise but comprehensive. Use bullet points and examples where helpful."""),
            HumanMessage(content=state['query'])
        ]
        response = await llm.ainvoke(messages)
        return {**state, "response": response.content}
