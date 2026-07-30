"""
Pydantic schemas for the AI service.
"""
from pydantic import BaseModel, Field
from typing import Any, Optional, Literal
from typing_extensions import TypedDict


# ─────────────────────────────────────────────
# LangGraph State
# ─────────────────────────────────────────────
class AgentState(TypedDict):
    """Shared state flowing through the LangGraph."""
    query: str
    user_email: str
    user_role: str
    session_id: str
    conversation_history: list[dict]
    target_agent: str
    intent: str
    entities: dict[str, Any]
    context: list[dict]       # Retrieved RAG documents
    sql_query: Optional[str]
    sql_result: Optional[list[dict]]
    chart_data: Optional[dict]
    response: str
    citations: list[str]
    workflow_definition: Optional[dict]
    error: Optional[str]
    stream_tokens: bool


# ─────────────────────────────────────────────
# API Request / Response
# ─────────────────────────────────────────────
class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    session_id: str = Field(default="default")
    stream: bool = Field(default=True)
    user_email: str = Field(default="")
    user_role: str = Field(default="ADMIN")


class ChatResponse(BaseModel):
    response: str
    agent_used: str
    intent: str
    chart_data: Optional[dict] = None
    citations: list[str] = []
    sql_query: Optional[str] = None
    workflow_definition: Optional[dict] = None
    session_id: str


# ─────────────────────────────────────────────
# Workflow Schemas
# ─────────────────────────────────────────────
class WorkflowStep(BaseModel):
    index: int
    name: str
    action: str
    params: dict[str, Any] = {}
    requires_approval: bool = False
    approver_role: Optional[str] = None


class WorkflowCondition(BaseModel):
    field: str
    operator: str  # equals, not_equals, less_than, greater_than, contains
    value: Any


class WorkflowConditionGroup(BaseModel):
    operator: Literal["AND", "OR"]
    conditions: list[WorkflowCondition | "WorkflowConditionGroup"]


class WorkflowDefinitionSchema(BaseModel):
    name: str
    description: str
    trigger_type: Literal["EVENT", "SCHEDULE", "THRESHOLD", "MANUAL"]
    trigger_config: dict[str, Any]
    conditions: Optional[WorkflowConditionGroup] = None
    steps: list[WorkflowStep]
    natural_language_input: str


class ParseWorkflowRequest(BaseModel):
    description: str = Field(..., min_length=10, max_length=1000)
    user_role: str = "ADMIN"


class ParseWorkflowResponse(BaseModel):
    workflow: WorkflowDefinitionSchema
    confidence: float
    explanation: str
    warnings: list[str] = []
