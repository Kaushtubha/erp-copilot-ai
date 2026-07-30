"""
ERP Copilot AI — FastAPI Application Entry Point.

Exposes:
  - /health        — Health check
  - /api/chat      — Streaming AI chat (SSE)
  - /api/agents/*  — Individual agent endpoints
  - /api/workflows/parse — Workflow NL parsing
  - /docs          — Swagger UI
"""
import logging
import structlog
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import Settings
from routers import chat, agents, workflows, health
from rag.qdrant_client import QdrantManager
from workflow.scheduler import WorkflowScheduler

settings = Settings()

# ─────────────────────────────────────────────
# Structured logging
# ─────────────────────────────────────────────
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.add_log_level,
        structlog.processors.JSONRenderer(),
    ]
)
log = structlog.get_logger()


# ─────────────────────────────────────────────
# Lifespan (startup / shutdown)
# ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("🚀 ERP Copilot AI Service starting...")

    # Initialize Qdrant collections
    qdrant = QdrantManager(settings)
    await qdrant.initialize_collections()
    app.state.qdrant = qdrant
    log.info("✅ Qdrant initialized")

    # Start workflow scheduler
    scheduler = WorkflowScheduler(settings)
    scheduler.start()
    app.state.scheduler = scheduler
    log.info("✅ Workflow scheduler started")

    yield  # App is running

    log.info("🛑 Shutting down ERP Copilot AI Service...")
    scheduler.stop()


# ─────────────────────────────────────────────
# FastAPI App
# ─────────────────────────────────────────────
app = FastAPI(
    title="ERP Copilot AI Service",
    description="Multi-agent LangGraph AI backend for ERP Copilot",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# Routers
# ─────────────────────────────────────────────
app.include_router(health.router, tags=["Health"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Chat"])
app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])
app.include_router(workflows.router, prefix="/api/workflows", tags=["Workflow Automation"])


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    log.error("unhandled_exception", error=str(exc), path=str(request.url))
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )
