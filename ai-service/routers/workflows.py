from fastapi import APIRouter
from models.schemas import ParseWorkflowRequest, ParseWorkflowResponse
from agents.workflow_automation_agent import WorkflowAutomationAgent
from config import Settings

router = APIRouter()
settings = Settings()


@router.post("/parse", response_model=ParseWorkflowResponse)
async def parse_workflow(request: ParseWorkflowRequest):
    """Parse natural language to workflow definition."""
    agent = WorkflowAutomationAgent(settings)
    state = {
        "query": request.description,
        "user_email": "system",
        "user_role": request.user_role,
        "session_id": "parse-session",
        "conversation_history": [],
        "target_agent": "workflow_agent",
        "intent": "workflow_create",
        "entities": {},
        "context": [],
        "sql_query": None,
        "sql_result": None,
        "chart_data": None,
        "response": "",
        "citations": [],
        "workflow_definition": None,
        "error": None,
        "stream_tokens": False,
    }
    result = await agent.run(state)
    workflow_def = result.get("workflow_definition", {})
    return ParseWorkflowResponse(
        workflow=workflow_def,
        confidence=workflow_def.get("confidence", 0.5),
        explanation=workflow_def.get("explanation", ""),
        warnings=workflow_def.get("warnings", []),
    )
