# ai-powered-recruitment-app ↔️ Job Description Matcher

Professional, full-stack application for automated candidate CV parsing, job-description summarization, and candidate-job matching using modular agent-based services.

## Project overview

Agent Match helps recruiters and hiring teams quickly find and assess candidates by:

- Parsing uploaded CVs and extracting structured data (skills, experience, education).
- Summarizing and extracting key points from job descriptions.
- Scoring and matching candidates to job descriptions.
- Assisting with scheduling interviews and summarization tasks.

The repository contains a React frontend and a FastAPI backend with modular "agents" implementing parsing, matching, summarization, and scheduling logic.

## Repository layout

- `frontend/` — React + Vite UI. Components include `CandidateMatcher`, `Dashboard`, `InterviewScheduler`, `JobDescriptionSummary`, `PDFPreview`, and charts for skills.
- `backend/` — FastAPI server. Key files:
  - `main.py` — FastAPI app entry.
  - `routes/` — API route modules (candidate and job routes).
  - `agents/` — modular agent scripts: CV parsing, JD matching, summarizer, scheduler.
  - `services/` — higher-level services orchestrating agents.
  - `database/models.py` — data models.

## Key features

- Accurate CV parsing into structured candidate profiles.
- Job description summarization and skills extraction.
- Candidate-to-job matching with configurable scoring.
- Simple UI for uploading CVs, viewing matches, and scheduling interviews.
- Modular agent architecture for easy extension and replacement.

## Tech stack

- Frontend: React, Vite
- Backend: Python, FastAPI, Uvicorn
- Data: Simple local models (see `backend/database/models.py`), easily replaceable with a persistent database
- Agents: Lightweight Python modules in `backend/agents`

## Quick start (Windows PowerShell)

Run the app locally on Windows (PowerShell). These commands assume you are at the repository root.

1. Backend — virtual environment, deps, run server

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

Open the frontend app in your browser at the address shown by Vite (usually `http://localhost:5173`) and ensure the backend is running at `http://localhost:8000` (update the frontend config if necessary).

## Configuration & environment

- Backend environment variables should be stored in `backend/.env` (do not commit secrets). Common variables:

  - API keys for external NLP/LLM providers
  - Database URL (if switching from local models to a DB)

- Frontend environment variables can be set via Vite's env files in `frontend/` when needed.

## API & integration points

- The backend exposes REST endpoints located in `backend/routes/` (candidate and job routes). Typical flows:
  - Upload CV -> candidate parsing endpoint
  - Submit job description -> job summarization endpoint
  - Request matches -> matching endpoint using `agents/matching_cv_jd_agent.py`

Inspect those files for exact endpoint names and request/response formats.

## Development notes

- Agents are small, focused modules. To change behavior, edit the relevant file under `backend/agents` and the service layer in `backend/services`.
- Prefer small, testable changes. Unit-test parsing and matching logic independently.

Suggested workflow:

1. Start backend (Uvicorn --reload) and frontend (Vite).
2. Modify agent or service code.
3. Add or update unit tests and validate via the API or UI.

## Testing

Add unit tests for critical agent logic (CV parsing, JD summarization, matching) using `pytest` in `backend/tests/` and run:

```powershell
# from backend folder
pytest -q
```

## Troubleshooting

- Backend port conflicts: change `--port` in the `uvicorn` command.
- Dependency issues: ensure the virtual environment is activated and `pip install -r requirements.txt` completed.
- Frontend CORS or API URL mismatch: update the API base URL in the frontend configuration to point at `http://localhost:8000`.

## Contributing

Contributions are welcome. Recommended steps:

1. Fork and create a feature branch.
2. Add or update unit tests for new behavior.
3. Open a clear PR describing the change and motivation.

## License & contact

Licensed under the MIT License (c) 2025 Mohamed Amine Ammar.  
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.  
For questions or support, please open an issue in the repository.

---
