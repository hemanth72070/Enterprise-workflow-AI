from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List

from security.dependencies import get_current_user


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


class Task(BaseModel):
    id: int
    name: str
    project: str
    assignee: str
    priority: str
    status: str
    due_date: str
    progress: int


# ==========================================
# TASK DATA
# ==========================================

tasks: List[Task] = [
    Task(
        id=1,
        name="Design Login Page",
        project="HR Portal",
        assignee="Rahul",
        priority="High",
        status="Completed",
        due_date="2026-08-10",
        progress=100
    ),

    Task(
        id=2,
        name="Create Dashboard",
        project="HR Portal",
        assignee="Priya",
        priority="Medium",
        status="Completed",
        due_date="2026-08-12",
        progress=100
    ),

    Task(
        id=3,
        name="Develop AI Assistant",
        project="Enterprise AI",
        assignee="Amit",
        priority="High",
        status="In Progress",
        due_date="2026-08-18",
        progress=65
    ),

    Task(
        id=4,
        name="Generate Reports",
        project="Enterprise AI",
        assignee="Sneha",
        priority="Medium",
        status="In Progress",
        due_date="2026-08-22",
        progress=40
    ),

    Task(
        id=5,
        name="Database Integration",
        project="Inventory System",
        assignee="Kiran",
        priority="High",
        status="Pending",
        due_date="2026-08-25",
        progress=10
    )
]


# ==========================================
# GET ALL TASKS
# ==========================================

@router.get("/")
def get_tasks(
    current_user: dict = Depends(get_current_user)
):
    return {
        "status": "success",
        "count": len(tasks),
        "tasks": tasks
    }


# ==========================================
# GET SINGLE TASK
# ==========================================

@router.get("/{task_id}")
def get_task(
    task_id: int,
    current_user: dict = Depends(get_current_user)
):

    for task in tasks:

        if task.id == task_id:
            return {
                "status": "success",
                "task": task
            }

    raise HTTPException(
        status_code=404,
        detail="Task not found"
    )


# ==========================================
# CREATE TASK
# ==========================================

@router.post("/")
def create_task(
    task: Task,
    current_user: dict = Depends(get_current_user)
):

    for existing_task in tasks:

        if existing_task.id == task.id:

            raise HTTPException(
                status_code=400,
                detail="Task ID already exists"
            )

    tasks.append(task)

    return {
        "status": "success",
        "message": "Task created successfully",
        "task": task
    }


# ==========================================
# DELETE TASK
# ==========================================

@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    current_user: dict = Depends(get_current_user)
):

    for task in tasks:

        if task.id == task_id:

            tasks.remove(task)

            return {
                "status": "success",
                "message": "Task deleted successfully"
            }

    raise HTTPException(
        status_code=404,
        detail="Task not found"
    )