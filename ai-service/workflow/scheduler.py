"""
Workflow Scheduler — APScheduler integration for cron-triggered workflows.
"""
import structlog
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from config import Settings

log = structlog.get_logger()


class WorkflowScheduler:
    """
    Manages scheduled workflow triggers using APScheduler.
    Loads active SCHEDULE-type workflows from the backend and registers cron jobs.
    """

    def __init__(self, settings: Settings):
        self.settings = settings
        self.scheduler = AsyncIOScheduler()

    def start(self):
        self.scheduler.start()
        log.info("workflow_scheduler_started")
        # Register a periodic check for new/updated workflows
        self.scheduler.add_job(
            self._reload_scheduled_workflows,
            trigger="interval",
            minutes=5,
            id="workflow_reload",
            replace_existing=True,
        )

    def stop(self):
        self.scheduler.shutdown(wait=False)
        log.info("workflow_scheduler_stopped")

    async def _reload_scheduled_workflows(self):
        """Fetch active SCHEDULE workflows from backend and register them."""
        import httpx
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    f"{self.settings.backend_base_url}/api/workflows",
                    params={"active": True, "triggerType": "SCHEDULE"}
                )
                if resp.status_code != 200:
                    return

                workflows = resp.json().get("content", [])
                for wf in workflows:
                    await self._register_workflow(wf)

        except Exception as e:
            log.error("workflow_reload_failed", error=str(e))

    async def _register_workflow(self, workflow: dict):
        """Register or update a cron job for a SCHEDULE workflow."""
        wf_id = workflow["id"]
        trigger_config = workflow.get("triggerConfig", {})
        cron_expr = trigger_config.get("cron", "0 9 * * *")
        timezone = trigger_config.get("timezone", "Asia/Kolkata")

        job_id = f"workflow_{wf_id}"
        if self.scheduler.get_job(job_id):
            self.scheduler.remove_job(job_id)

        self.scheduler.add_job(
            self._execute_workflow,
            trigger=CronTrigger.from_crontab(cron_expr, timezone=timezone),
            args=[wf_id, workflow["name"]],
            id=job_id,
            replace_existing=True,
        )
        log.info("workflow_registered", id=wf_id, name=workflow["name"], cron=cron_expr)

    async def _execute_workflow(self, workflow_id: str, workflow_name: str):
        """Trigger workflow execution via the backend API."""
        import httpx
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    f"{self.settings.backend_base_url}/api/workflows/{workflow_id}/run"
                )
                log.info("workflow_triggered", id=workflow_id, name=workflow_name, status=resp.status_code)
        except Exception as e:
            log.error("workflow_trigger_failed", id=workflow_id, error=str(e))
