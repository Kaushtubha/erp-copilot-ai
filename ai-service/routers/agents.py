from fastapi import APIRouter
router = APIRouter()

@router.get("/status")
async def agent_status():
    return {
        "agents": [
            "planner", "inventory", "warehouse", "sales",
            "purchase", "analytics", "forecast", "report",
            "sql", "chart", "explanation", "workflow_automation"
        ],
        "status": "all_healthy"
    }
