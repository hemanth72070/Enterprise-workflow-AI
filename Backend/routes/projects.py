from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List

from security.dependencies import get_current_user


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


class Project(BaseModel):
    id: int
    name: str
    manager: str
    description: str
    status: str
    progress: int
    tasks: int


projects: List[Project] = [
    Project(
        id=1,
        name="HR Portal",
        manager="Rahul",
        description="Employee management and HR workflow system",
        status="Active",
        progress=75,
        tasks=12
    ),
    Project(
        id=2,
        name="Inventory System",
        manager="Priya",
        description="Stock tracking and inventory management",
        status="Completed",
        progress=100,
        tasks=10
    ),
    Project(
        id=3,
        name="Website Development",
        manager="Amit",
        description="Corporate website development project",
        status="In Progress",
        progress=55,
        tasks=13
    )
]


@router.get("/")
def get_projects(
    current_user: dict = Depends(get_current_user)
):
    return {
        "status": "success",
        "count": len(projects),
        "projects": projects
    }


@router.get("/{project_id}")
def get_project(
    project_id: int,
    current_user: dict = Depends(get_current_user)
):
    for project in projects:
        if project.id == project_id:
            return {
                "status": "success",
                "project": project
            }

    raise HTTPException(
        status_code=404,
        detail="Project not found"
    )


@router.post("/")
def create_project(
    project: Project,
    current_user: dict = Depends(get_current_user)
):
    for existing_project in projects:
        if existing_project.id == project.id:
            raise HTTPException(
                status_code=400,
                detail="Project ID already exists"
            )

    projects.append(project)

    return {
        "status": "success",
        "message": "Project created successfully",
        "project": project
    }


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    current_user: dict = Depends(get_current_user)
):
    for project in projects:
        if project.id == project_id:
            projects.remove(project)

            return {
                "status": "success",
                "message": "Project deleted successfully"
            }

    raise HTTPException(
        status_code=404,
        detail="Project not found"
    )