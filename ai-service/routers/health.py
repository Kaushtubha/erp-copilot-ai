from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.get("/health")
async def health():
    return {"status": "healthy", "service": "erp-copilot-ai-service", "version": "1.0.0"}
