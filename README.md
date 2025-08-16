# 🤖 AI CV-JD Matcher

> **Smart recruitment automation**: Parse CVs, summarize job descriptions, calculate match scores, and send interview invitations using AI-powered agents.

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)

---

## 🌟 Features

- **📄 CV Parsing**: Extract text from PDF/Word documents
- **📝 JD Summarization**: AI-powered job description summarization
- **🎯 Smart Matching**: Fuzzy matching algorithm with weighted scoring
- **📊 Interactive Dashboard**: Real-time visualization of match scores
- **📧 Auto Email**: Send interview invitations automatically
- **🔧 Agent Architecture**: Modular AI agents for each task

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Services   │
│   (React)       │◄──►│   (FastAPI)     │◄──►│                 │
│                 │    │                 │    │ • Hugging Face  │
│ • Dashboard     │    │ • REST APIs     │    │ • OpenRouter    │
│ • File Upload   │    │ • Agent System  │    │ • Local ML      │
│ • Visualizations│    │ • SMTP Service  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
job-match-cv-react-fastapi/
├── 🔧 docker-compose.yml          # Container orchestration
├── 📖 README.md                   # Project documentation
├── 🚀 render-start.sh             # Deployment script
│
├── 🔙 backend/
│   ├── 🐍 main.py                 # FastAPI application entry
│   ├── 📦 requirements.txt        # Python dependencies
│   ├── 🐳 Dockerfile              # Backend container
│   │
│   ├── 🤖 agents/                 # AI Agent modules
│   │   ├── cv_parser_agent.py     # PDF/text extraction
│   │   ├── matching_cv_jd_agent.py# Scoring algorithms
│   │   ├── summarizer_agent.py    # LLM field extraction
│   │   └── scheduler_agent.py     # Email automation
│   │
│   ├── 🗄️ database/
│   │   └── models.py              # Data models
│   │
│   ├── 🛣️ routes/                 # API endpoints
│   │   ├── candidate_routes.py    # Candidate operations
│   │   └── job_routes.py          # Job operations
│   │
│   └── ⚙️ services/               # Business logic
│       ├── candidate_service.py   # Candidate orchestration
│       └── summarization_service.py# AI summarization
│
└── 🎨 frontend/
    ├── 📦 package.json            # Node.js dependencies
    ├── 🐳 Dockerfile              # Frontend container
    ├── ⚡ vite.config.js          # Vite configuration
    │
    └── 📁 src/
        ├── 📱 App.jsx             # Main application
        ├── 🎨 main.jsx            # React entry point
        │
        ├── 🌐 api/
        │   └── client.js          # API client
        │
        └── 🧩 components/         # React components
            ├── CandidateMatcher.jsx
            ├── Dashboard.jsx
            ├── InterviewScheduler.jsx
            ├── JobDescriptionSummary.jsx
            ├── LandingPage.jsx
            ├── PDFPreview.jsx
            ├── SkillChart.jsx
            └── SkillsBreakdownChart.jsx
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Docker (optional)

### 🔧 Local Development

#### Backend Setup

```powershell
# Navigate to backend directory
Set-Location backend

# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn main:app --reload --port 8000
```

#### Frontend Setup

```powershell
# Navigate to frontend directory
Set-Location frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 🐳 Docker Deployment

```powershell
# Build and run with Docker Compose
docker-compose up --build

# Or run individually
docker build -t cv-matcher-backend ./backend
docker build -t cv-matcher-frontend ./frontend
```

**Access Points:**

- 🎨 Frontend: http://localhost:5173
- 🔙 Backend API: http://localhost:8000
- 📚 API Docs: http://localhost:8000/docs

## ⚙️ Configuration

Create a `.env` file in the backend directory:

```env
# Required: Hugging Face API
HF_TOKEN=your_hugging_face_token
HF_SUMMARIZATION_MODEL=facebook/bart-large-cnn

# Optional: Advanced LLM features
OPENROUTER_API_KEY=your_openrouter_key

# Optional: Email automation
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=AI Recruiter <your_email@gmail.com>
```

## 🎯 API Endpoints

| Method | Endpoint                | Description               | Request             | Response                |
| ------ | ----------------------- | ------------------------- | ------------------- | ----------------------- |
| `GET`  | `/`                     | Health check              | -                   | Status message          |
| `POST` | `/summarize_jd`         | Summarize job description | File upload         | JD summary              |
| `POST` | `/parse_cv`             | Extract CV text           | File upload         | Extracted text          |
| `POST` | `/match_cv_jd`          | Calculate match score     | Candidate + JD data | Match score & breakdown |
| `POST` | `/send_interview_email` | Send interview invite     | Candidate data      | Email status            |

## 🧮 Scoring Algorithm

The matching algorithm uses weighted scoring across multiple dimensions:

| Dimension         | Weight | Description                              |
| ----------------- | ------ | ---------------------------------------- |
| 🛠️ **Skills**     | 40%    | Technical and soft skills matching       |
| 💼 **Experience** | 25%    | Years of experience and role relevance   |
| 🎓 **Education**  | 15%    | Degree level and field of study          |
| 🏢 **Industry**   | 20%    | Industry background and domain knowledge |

**Scoring Features:**

- Fuzzy string matching for partial matches
- Penalty systems for missing critical requirements
- Bonus points for exceeding requirements
- Normalized scores (0-100 scale)

## 🤖 AI Components

### 1. **Summarization Agent**

- **Service**: Hugging Face Inference API
- **Model**: `facebook/bart-large-cnn`
- **Purpose**: Extract key information from job descriptions

### 2. **LLM Extraction Agent** (Optional)

- **Service**: OpenRouter API
- **Model**: `openai/gpt-oss-20b:free`
- **Purpose**: Structured field extraction (skills, experience, qualifications)

### 3. **Parser Agent**

- **Technology**: Local Python libraries
- **Formats**: PDF, DOCX, TXT
- **Features**: Text extraction, formatting cleanup

### 4. **Matching Agent**

- **Algorithm**: RapidFuzz + Custom heuristics
- **Features**: Multi-dimensional scoring, fuzzy matching
- **Performance**: Local processing, no API calls

### 5. **Scheduler Agent**

- **Protocol**: SMTP with TLS
- **Features**: Template-based emails, async sending
- **Fallback**: Graceful degradation if email unavailable

## 🛠️ Tech Stack

### Backend

- **Framework**: FastAPI
- **Language**: Python 3.8+
- **AI/ML**: Hugging Face Transformers, RapidFuzz
- **Email**: aiosmtplib
- **File Processing**: PyPDF2, python-docx

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **File Upload**: React Dropzone
- **PDF Viewer**: React-PDF

### DevOps

- **Containerization**: Docker & Docker Compose
- **Deployment**: Render (cloud-ready)
- **Environment**: Cross-platform support

## 🔍 Troubleshooting

### Common Issues

**❌ Empty job summary**

```
Solution: Verify HF_TOKEN in .env file
Check: Hugging Face API quotas and model availability
```

**❌ Email sending fails**

```
Solution: Confirm SMTP credentials and app password
Check: Port 587 accessibility and TLS configuration
```

**❌ Low match scores**

```
Solution: Ensure job description contains technical terms
Check: CV parsing quality and keyword extraction
```

**❌ File upload errors**

```
Solution: Verify file format (PDF/DOCX) and size limits
Check: Backend CORS configuration
```

## 🚀 Deployment

### Render.com (Recommended)

```bash
# Use provided deployment script
./render-start.sh
```

### Custom Docker Deployment

```bash
# Production build
docker-compose -f docker-compose.prod.yml up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License © 2025 Mohamed Amine Ammar

---

<div align="center">

**Built with ❤️ for smarter recruitment**

[🐛 Report Bug](https://github.com/aminammar1/agent-match-jd-cv/issues) • [✨ Request Feature](https://github.com/aminammar1/agent-match-jd-cv/issues) • [📖 Documentation](https://github.com/aminammar1/agent-match-jd-cv/wiki)

</div>
