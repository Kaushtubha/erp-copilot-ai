"""
ERP LangGraph Multi-Agent Workflow.

Graph structure:
  START → planner → router →
    inventory_agent    → synthesizer → END
    warehouse_agent    ↗
    sales_agent        ↗
    purchase_agent     ↗
    analytics_agent    ↗
    forecast_agent     ↗
    report_agent       ↗
    sql_agent          ↗
    chart_agent        ↗
    explanation_agent  ↗
    workflow_agent     ↗
"""
from typing import TypedDict, Annotated, Sequence, Literal
from langgraph.graph import StateGraph, END, START
from langgraph.checkpoint.memory import MemorySaver

from agents.planner_agent import PlannerAgent
from agents.inventory_agent import InventoryAgent
from agents.warehouse_agent import WarehouseAgent
from agents.sales_agent import SalesAgent
from agents.purchase_agent import PurchaseAgent
from agents.analytics_agent import AnalyticsAgent
from agents.forecast_agent import ForecastAgent
from agents.report_agent import ReportAgent
from agents.sql_agent import SQLAgent
from agents.chart_agent import ChartAgent
from agents.explanation_agent import ExplanationAgent
from agents.workflow_automation_agent import WorkflowAutomationAgent
from models.schemas import AgentState


def create_erp_graph(settings) -> StateGraph:
    """Build and compile the ERP multi-agent LangGraph."""

    # Initialize all agents
    planner = PlannerAgent(settings)
    inventory = InventoryAgent(settings)
    warehouse = WarehouseAgent(settings)
    sales = SalesAgent(settings)
    purchase = PurchaseAgent(settings)
    analytics = AnalyticsAgent(settings)
    forecast = ForecastAgent(settings)
    report = ReportAgent(settings)
    sql = SQLAgent(settings)
    chart = ChartAgent(settings)
    explanation = ExplanationAgent(settings)
    workflow_agent = WorkflowAutomationAgent(settings)

    # Build the graph
    builder = StateGraph(AgentState)

    # Add nodes
    builder.add_node("planner", planner.run)
    builder.add_node("inventory_agent", inventory.run)
    builder.add_node("warehouse_agent", warehouse.run)
    builder.add_node("sales_agent", sales.run)
    builder.add_node("purchase_agent", purchase.run)
    builder.add_node("analytics_agent", analytics.run)
    builder.add_node("forecast_agent", forecast.run)
    builder.add_node("report_agent", report.run)
    builder.add_node("sql_agent", sql.run)
    builder.add_node("chart_agent", chart.run)
    builder.add_node("explanation_agent", explanation.run)
    builder.add_node("workflow_agent", workflow_agent.run)

    # Routing function
    def route_to_agent(state: AgentState) -> str:
        return state.get("target_agent", "explanation_agent")

    # Edges
    builder.add_edge(START, "planner")
    builder.add_conditional_edges(
        "planner",
        route_to_agent,
        {
            "inventory_agent": "inventory_agent",
            "warehouse_agent": "warehouse_agent",
            "sales_agent": "sales_agent",
            "purchase_agent": "purchase_agent",
            "analytics_agent": "analytics_agent",
            "forecast_agent": "forecast_agent",
            "report_agent": "report_agent",
            "sql_agent": "sql_agent",
            "chart_agent": "chart_agent",
            "explanation_agent": "explanation_agent",
            "workflow_agent": "workflow_agent",
        }
    )

    # All agents → END
    for agent_node in [
        "inventory_agent", "warehouse_agent", "sales_agent",
        "purchase_agent", "analytics_agent", "forecast_agent",
        "report_agent", "sql_agent", "chart_agent",
        "explanation_agent", "workflow_agent"
    ]:
        builder.add_edge(agent_node, END)

    # Compile with memory checkpointing for conversation continuity
    memory = MemorySaver()
    return builder.compile(checkpointer=memory)


# Singleton graph instance
_graph = None

def get_graph(settings):
    global _graph
    if _graph is None:
        _graph = create_erp_graph(settings)
    return _graph
