from fastapi import APIRouter, Depends

from routes.projects import projects
from routes.tasks import tasks

from security.dependencies import get_current_user


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/summary")
def get_summary(
    current_user: dict = Depends(get_current_user)
):
    total_projects = len(projects)

    total_tasks = len(tasks)

    completed_tasks = sum(
        1
        for task in tasks
        if task.status.lower() == "completed"
    )

    pending_tasks = sum(
        1
        for task in tasks
        if task.status.lower() == "pending"
    )

    in_progress_tasks = sum(
        1
        for task in tasks
        if task.status.lower() == "in progress"
    )

    high_risk_tasks = sum(
        1
        for task in tasks
        if task.priority.lower() == "high"
        and task.status.lower() != "completed"
    )

    if total_tasks > 0:
        completion_percentage = round(
            (completed_tasks / total_tasks) * 100,
            2
        )
    else:
        completion_percentage = 0

    return {
        "status": "success",
        "summary": {
            "total_projects": total_projects,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "in_progress_tasks": in_progress_tasks,
            "high_risk_tasks": high_risk_tasks,
            "completion_percentage": completion_percentage
        }
    }