from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.projects import router as project_router
from routes.tasks import router as task_router
from routes.decisions import router as decision_router
from routes.reports import router as reports_router
from routes.assistant import router as assistant_router
from routes.auth import router as auth_router


app = FastAPI(
    title="Enterprise AI Workflow Platform",
    description="Enterprise Workflow Platform with Decision Automation",
    version="1.0.0"
)


# Allow the React frontend to communicate with FastAPI

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routes

app.include_router(project_router)
app.include_router(task_router)
app.include_router(decision_router)
app.include_router(reports_router)
app.include_router(assistant_router)
app.include_router(auth_router)


@app.get("/")
def root():
    return {
        "message": "Enterprise AI Workflow Platform API is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }