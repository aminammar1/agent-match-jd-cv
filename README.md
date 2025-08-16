<div align="center">

# AI CV ↔ JD Matcher

Lightweight recruitment helper: parse CVs, summarize job descriptions, score matches, send interview invites.

</div>

---

## Overview

Uploads a Job Description (JD) and Candidate CV, produces a concise JD summary (Hugging Face), extracts CV text, and calculates a match score using deterministic heuristics + fuzzy skill matching. Optional LLM step (OpenRouter) can turn JD into structured fields. High scores can trigger an email invite.

## Folder Structure

```
backend/
  main.py                  # FastAPI entry
  agents/
    cv_parser_agent.py     # PDF/text extraction
    matching_cv_jd_agent.py# Scoring logic
    summarizer_agent.py    # (Optional) LLM field extraction
    scheduler_agent.py     # SMTP email sender
  services/
    summarization_service.py # Hugging Face JD summarization
    candidate_service.py     # Orchestrates parse/match/email
  routes/                  # API endpoints
  database/models.py       # Placeholder
  .env                     # Environment variables

frontend/
  src/ (React components, api client)
  package.json

render-start.sh / render-build.sh  # Deployment helpers
Dockerfile / docker-compose.yml    # Containerization
```

## AI Components

- Hugging Face Inference API: Summarizes JD text (remote model, no local GPU).
- OpenRouter LLM (optional): Structured extraction (skills, experience fields).
- Matching: Local Python (RapidFuzz + regex). No external call.

## Tech Stack

FastAPI, React + Vite, RapidFuzz, aiosmtplib, Hugging Face Inference API, optional OpenRouter LLM.

## Run (Windows PowerShell)

Backend:

```powershell
Set-Location backend
python -m venv .venv; . .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Frontend:

```powershell
Set-Location frontend
npm install
npm run dev
```

Open: http://localhost:5173 (UI) → backend at http://localhost:8000

## Key Environment Variables (backend/.env)

```
HF_TOKEN=your_hf_api_token
HF_SUMMARIZATION_MODEL=facebook/bart-large-cnn
OPENROUTER_API_KEY=your_openrouter_key   # (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=Recruiting Bot <your_email@gmail.com>
```

Only set what you use.

## Core Endpoints

| Endpoint                   | Purpose                                |
| -------------------------- | -------------------------------------- |
| POST /summarize_jd         | Upload JD file → summary               |
| POST /parse_cv             | Upload CV → extracted text             |
| POST /match_cv_jd          | Provide candidate + jd summary → score |
| POST /send_interview_email | Send invite if score high              |

## Match Scoring (Default Weights)

Skills 40% • Experience 25% • Education 15% • Industry 20%  
Partial matches credited via fuzzy ratio. Bounds and penalties keep scores realistic.

## Email

`scheduler_agent.py` sends a simple invitation via SMTP using env credentials. Fails gracefully if not configured.

## Docker

```powershell
docker build -t cv-matcher .
docker run -p 8000:8000 cv-matcher
```

## Troubleshooting

- Empty summary → check HF token
- Email fail → verify app password / port 587 TLS
- Low match → ensure JD summary retained key tech terms

## License

MIT © 2025 Mohamed Amine Ammar
