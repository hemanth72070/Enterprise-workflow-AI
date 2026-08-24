from fastapi import APIRouter, Depends
from pydantic import BaseModel

from routes.tasks import tasks
from services.decision_engine import evaluate_task
from security.dependencies import get_current_user


router = APIRouter(
    prefix="/assistant",
    tags=["AI Assistant"]
)


class AssistantQuery(BaseModel):
    question: str


@router.post("/query")
def assistant_query(
    query: AssistantQuery,
    current_user: dict = Depends(get_current_user)
):

    question = query.question.lower().strip()

    # ==========================================
    # ANALYZE TASKS
    # ==========================================

    analyzed_tasks = []

    for task in tasks:

        task_data = {
            "priority": task.priority,
            "status": task.status,
            "progress": task.progress
        }

        decision = evaluate_task(task_data)

        analyzed_tasks.append({
            "task_id": task.id,
            "task_name": task.name,
            "project": task.project,
            "assignee": task.assignee,
            "priority": task.priority,
            "status": task.status,
            "progress": task.progress,
            "due_date": task.due_date,
            **decision
        })

    # ==========================================
    # WORKFLOW SUMMARY
    # ==========================================

    if (
        "summary" in question
        or "overview" in question
        or "workflow status" in question
    ):

        total_tasks = len(tasks)

        completed = [
            task for task in tasks
            if task.status.lower() == "completed"
        ]

        in_progress = [
            task for task in tasks
            if task.status.lower() == "in progress"
        ]

        pending = [
            task for task in tasks
            if task.status.lower() == "pending"
        ]

        high_risk = [
            task for task in analyzed_tasks
            if task["risk_level"] == "HIGH"
        ]

        projects = list(
            dict.fromkeys(
                task.project for task in tasks
            )
        )

        answer = (
            f"Here is the current workflow summary:\n\n"
            f"Total tasks: {total_tasks}\n"
            f"Completed: {len(completed)}\n"
            f"In progress: {len(in_progress)}\n"
            f"Pending: {len(pending)}\n"
            f"High-risk tasks: {len(high_risk)}\n"
            f"Projects: {len(projects)}"
        )

        return {
            "status": "success",
            "question": query.question,
            "answer": answer
        }

    # ==========================================
    # TOTAL TASKS
    # ==========================================

    if (
        "how many tasks" in question
        or "total tasks" in question
        or "number of tasks" in question
    ):

        answer = (
            f"There are currently {len(tasks)} tasks "
            f"in the workflow."
        )

        return {
            "status": "success",
            "question": query.question,
            "answer": answer
        }

    # ==========================================
    # HIGH PRIORITY TASKS
    # ==========================================

    if (
        "high priority" in question
        or "high-priority" in question
    ):

        high_priority = [
            task for task in tasks
            if task.priority.lower() == "high"
        ]

        if high_priority:

            task_names = ", ".join(
                task.name
                for task in high_priority
            )

            answer = (
                f"There are {len(high_priority)} "
                f"high-priority tasks: {task_names}."
            )

        else:

            answer = (
                "There are currently no high-priority tasks."
            )

        return {
            "status": "success",
            "question": query.question,
            "answer": answer
        }

    # ==========================================
    # IN-PROGRESS TASKS
    # ==========================================

    if (
        "in progress" in question
        or "in-progress" in question
        or "ongoing" in question
    ):

        in_progress = [
            task for task in tasks
            if task.status.lower() == "in progress"
        ]

        if in_progress:

            task_names = ", ".join(
                task.name
                for task in in_progress
            )

            answer = (
                f"There are {len(in_progress)} tasks "
                f"currently in progress: {task_names}."
            )

        else:

            answer = (
                "There are currently no tasks in progress."
            )

        return {
            "status": "success",
            "question": query.question,
            "answer": answer
        }

    # ==========================================
    # HIGH-RISK TASKS
    # ==========================================

    if (
        "high risk" in question
        or "high-risk" in question
    ):

        high_risk_tasks = [
            task
            for task in analyzed_tasks
            if task["risk_level"] == "HIGH"
        ]

        if not high_risk_tasks:

            answer = (
                "There are currently no high-risk tasks."
            )

        else:

            task_names = ", ".join(
                task["task_name"]
                for task in high_risk_tasks
            )

            answer = (
                f"The following tasks are currently high risk: "
                f"{task_names}. "
                f"These tasks require immediate attention."
            )

        return {
            "status": "success",
            "question": query.question,
            "answer": answer
        }

    # ==========================================
    # COMPLETED TASKS
    # ==========================================

    if "completed" in question:

        completed_tasks = [
            task for task in tasks
            if task.status.lower() == "completed"
        ]

        if completed_tasks:

            task_names = ", ".join(
                task.name
                for task in completed_tasks
            )

            answer = (
                f"There are {len(completed_tasks)} "
                f"completed tasks: {task_names}."
            )

        else:

            answer = (
                "There are currently no completed tasks."
            )

        return {
            "status": "success",
            "question": query.question,
            "answer": answer
        }

    # ==========================================
    # PENDING TASKS
    # ==========================================

    if "pending" in question:

        pending_tasks = [
            task for task in tasks
            if task.status.lower() == "pending"
        ]

        if pending_tasks:

            task_names = ", ".join(
                task.name
                for task in pending_tasks
            )

            answer = (
                f"There are {len(pending_tasks)} "
                f"pending tasks: {task_names}."
            )

        else:

            answer = (
                "There are currently no pending tasks."
            )

        return {
            "status": "success",
            "question": query.question,
            "answer": answer
        }

    # ==========================================
    # URGENT / ATTENTION
    # ==========================================

    if (
        "immediate attention" in question
        or "need attention" in question
        or "urgent" in question
        or "what needs attention" in question
    ):

        urgent_tasks = [
            task
            for task in analyzed_tasks
            if task["risk_level"] == "HIGH"
        ]

        if urgent_tasks:

            task_names = ", ".join(
                task["task_name"]
                for task in urgent_tasks
            )

            answer = (
                f"These tasks require immediate attention: "
                f"{task_names}."
            )

        else:

            answer = (
                "No tasks currently require immediate attention."
            )

        return {
            "status": "success",
            "question": query.question,
            "answer": answer
        }

    # ==========================================
    # PROJECTS
    # ==========================================

    if (
        "project" in question
        or "projects" in question
    ):

        project_names = list(
            dict.fromkeys(
                task.project
                for task in tasks
            )
        )

        answer = (
            f"There are {len(project_names)} projects "
            f"in the current workflow: "
            f"{', '.join(project_names)}."
        )

        return {
            "status": "success",
            "question": query.question,
            "answer": answer
        }

    # ==========================================
    # DEFAULT RESPONSE
    # ==========================================

    answer = (
        "I can help you analyze the workflow.\n\n"
        "You can ask me about:\n"
        "- Workflow summary\n"
        "- Total tasks\n"
        "- High-risk tasks\n"
        "- High-priority tasks\n"
        "- Pending tasks\n"
        "- Completed tasks\n"
        "- In-progress tasks\n"
        "- Urgent tasks\n"
        "- Projects"
    )

    return {
        "status": "success",
        "question": query.question,
        "answer": answer
    }