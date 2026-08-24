# Enterprise AI Workflow Platform

Enterprise AI Workflow Platform is a React and FastAPI application for managing projects, tasks, reports, decisions, and AI-assisted workflow operations.

## Features

- Dashboard with workflow summaries and decision analysis
- Project and task management views
- AI assistant interface
- Reports and decision scanning
- Authentication-aware frontend routing
- FastAPI backend with modular route, security, database, and service layers

## Tech Stack

- React 19
- Vite
- React Router
- FastAPI
- MongoDB integration

## Project Structure

```text
enterprise-ai-demo/
|-- Backend/
|   |-- database/       Database connections and MongoDB helpers
|   |-- models/         Backend data models
|   |-- routes/         Authentication, projects, tasks, reports, and AI routes
|   |-- security/       Authentication and request dependencies
|   `-- services/       Decision automation services
|-- public/              Static frontend assets
|-- src/
|   |-- components/      Shared UI components
|   `-- pages/           Dashboard, projects, tasks, reports, and settings pages
|-- package.json
`-- vite.config.js
```

## Prerequisites

- Node.js 18 or newer
- Python 3.10 or newer
- MongoDB, if required by the configured backend data access

## Frontend Setup

From the project root:

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and expects the API at `http://localhost:8000`.

Useful commands:

```bash
npm run build
npm run lint
npm run preview
```

## Backend Setup

From the project root:

```bash
cd Backend
python -m venv venv
```

Activate the virtual environment, install the backend dependencies configured for your environment, and start FastAPI:

```bash
# Windows PowerShell
.\venv\Scripts\Activate.ps1

uvicorn main:app --reload --port 8000
```

The API root is `http://localhost:8000/`, and the health check is available at `http://localhost:8000/health`.

## Authentication

The frontend stores the access token in browser local storage after login and sends it as a Bearer token to protected API endpoints. Configure the backend authentication and database settings for your local environment before using protected workflows.

## License

This project is licensed under the MIT License.
