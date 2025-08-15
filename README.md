<div align="center">

# 🤖 AI Recruitment App · CV JD Matcher

Automated CV parsing, job description summarization, and candidate  job matching with FastAPI + React.

</div>

---

## 📑 Table of Contents

1. 🧭 Overview
2. ✨ Features
3. 🧱 Architecture & Structure
4. 🛠 Tech Stack
5. 🚀 Quick Start
6. ⚙️ Configuration
7. 🔌 API Overview
8. 🧪 Development Workflow
9. ✅ Testing
10. 🐳 Container Image
11. ☁️ Render Deployment
12. 🔄 CI/CD
13. 🤝 Contributing
14. 📄 License

---

## 🧭 Overview

This app helps recruiters rapidly evaluate candidates against job descriptions by:

- Parsing CV files into structured profiles (skills, experience, education).
- Summarizing and extracting skill signals from job descriptions.
- Scoring & matching candidates to roles.
- Supporting interview scheduling / summarization flows.

The system is split into a React SPA and a FastAPI backend with modular "agents" (parsing, matching, summarizing, scheduling) for easy extension.

## ✨ Features

- CV parsing → structured candidate objects.
- JD summarization & skill extraction.
- Match scoring with extensible logic.
- Single-container deployment (serves API + SPA).
- Simple deployment scripts for Render.
- Modular agent architecture.

## 🧱 Architecture & Structure

Top-level folders:

| Path              | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| `frontend/`       | React + Vite application (components, charts, pages).       |
| `backend/`        | FastAPI app (`main.py`, routers, agents, services, models). |
| `render-build.sh` | Build script (backend deps + frontend build).               |
| `render-start.sh` | Start script (runs Uvicorn).                                |
| `Dockerfile`      | Multi-stage build: frontend → backend runtime.              |

Backend key areas:

- `routes/` candidate + job API endpoints.
- `agents/` feature-specific logic (parse, match, summarize, schedule).
- `services/` orchestration / higher-level operations.
- `database/models.py` data layer placeholder (swapable for real DB).

## 🛠 Tech Stack

- Frontend: React, Vite
- Backend: FastAPI (Uvicorn ASGI server)
- Language: Python 3.11, Node 20
- Build: Multi-stage Docker (Node → Python slim)
- Deployment Targets: Container platforms / Render Web Service

## 🚀 Quick Start (Windows / PowerShell)

Local development (separate processes). At repo root.

1. Backend (venv + run)

```powershell
# move into the backend folder
Set-Location -Path .\backend

# create and activate venv (PowerShell)
python -m venv .venv
. .\.venv\Scripts\Activate.ps1

# install Python dependencies
pip install -r requirements.txt

# start the server (development)
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

2. Frontend — install node deps and start Vite dev server

```powershell
# in a new terminal, move into the frontend folder
Set-Location -Path .\frontend

# install dependencies
npm install

# run the dev server
npm run dev
```

Visit frontend (usually `http://localhost:5173`) while backend runs on `http://localhost:8000`.

## ⚙️ Configuration

- Backend environment variables should be stored in `backend/.env` (do not commit secrets). Common variables:

  - API keys for external NLP/LLM providers
  - Database URL (if switching from local models to a DB)

- Frontend environment variables can be set via Vite's env files in `frontend/` when needed.

## 🔌 API Overview

- The backend exposes REST endpoints located in `backend/routes/` (candidate and job routes). Typical flows:
  - Upload CV -> candidate parsing endpoint
  - Submit job description -> job summarization endpoint
  - Request matches -> matching endpoint using `agents/matching_cv_jd_agent.py`

Inspect those files for exact endpoint names and request/response formats.

## 🧪 Development Workflow

- Agents are small, focused modules. To change behavior, edit the relevant file under `backend/agents` and the service layer in `backend/services`.
- Prefer small, testable changes. Unit-test parsing and matching logic independently.

Suggested workflow:

1. Start backend (Uvicorn --reload) and frontend (Vite).
2. Modify agent or service code.
3. Add or update unit tests and validate via the API or UI.

## ✅ Testing

Add unit tests for critical agent logic (CV parsing, JD summarization, matching) using `pytest` in `backend/tests/` and run:

```powershell
# from backend folder
pytest -q
```

## 🛟 Troubleshooting

- Backend port conflicts: change `--port` in the `uvicorn` command.
- Dependency issues: ensure the virtual environment is activated and `pip install -r requirements.txt` completed.
- Frontend CORS or API URL mismatch: update the API base URL in the frontend configuration to point at `http://localhost:8000`.

## 🤝 Contributing

Contributions are welcome. Recommended steps:

1. Fork and create a feature branch.
2. Add or update unit tests for new behavior.
3. Open a clear PR describing the change and motivation.

## 📄 License

Licensed under the MIT License (c) 2025 Mohamed Amine Ammar.  
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.  
For questions or support, please open an issue in the repository.

---

## 🐳 Container Image

Build single image (frontend build embedded, served by FastAPI):

```powershell
docker build -t cv-matcher .
docker run -p 8000:8000 cv-matcher
```

Open http://localhost:8000 (API root) — SPA routes fallback to `index.html`.

## ☁️ Deploy on Render

1. Create Web Service (root of repo)
2. Runtime: Python 3.11
3. Build Command:

```bash
bash render-build.sh
```

4. Start Command:

```bash
bash render-start.sh
```

5. Configure env vars (API keys, DB URL, etc.)

`render-build.sh` → installs backend deps, builds frontend, copies `frontend_dist`.
`render-start.sh` → runs Uvicorn.

## 🔄 CI/CD

| Workflow      | Purpose                                                      |
| ------------- | ------------------------------------------------------------ |
| `ci.yml`      | Install deps, build frontend, integrate, smoke start server. |
| `release.yml` | Build tagged images on GitHub Release publish.               |

Possible enhancements (not enabled): caching layers, security scan, test matrix.

---

## 🤝 Contributing

1. Fork & branch
2. Implement change (keep agents modular)
3. Ensure build passes (CI smoke)
4. Open PR with clear description

## 📄 License

MIT License (c) 2025 Mohamed Amine Ammar

THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY.
