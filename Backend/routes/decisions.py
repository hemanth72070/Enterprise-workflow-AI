from fastapi import APIRouter, Depends

from services.decision_engine import evaluate_task
from routes.tasks import tasks

from security.dependencies import get_current_user


router = APIRouter(
    prefix="/decisions",
    tags=["Decision Automation"]
)


@router.post("/evaluate")
def evaluate_workflow(
    task: dict,
    current_user: dict = Depends(get_current_user)
):
    result = evaluate_task(task)

    return {
        "status": "success",
        "input": task,
        "automation_result": result
    }


@router.get("/scan")
def scan_all_tasks(
    current_user: dict = Depends(get_current_user)
):
    results = []

    for task in tasks:

        task_data = task.model_dump()

        decision = evaluate_task(task_data)

        results.append({
            "task_id": task.id,
            "task_name": task.name,
            "project": task.project,
            "assignee": task.assignee,
            "status": task.status,
            "progress": task.progress,
            "risk_level": decision["risk_level"],
            "decision": decision["decision"],
            "recommendation": decision["recommendation"]
        })

    return {
        "status": "success",
        "total_tasks": len(results),
        "results": results
    }