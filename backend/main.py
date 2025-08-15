from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
import uvicorn
from pathlib import Path
from routes.job_routes import router as job_router
from routes.candidate_routes import router as candidate_router

app = FastAPI(title="CV Matching JD AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(job_router)
app.include_router(candidate_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the CV Matching JD AI API", "docs": "/docs"}

# Serve built frontend if present (frontend_dist created during build)
FRONTEND_DIST = Path(__file__).parent / "frontend_dist"
INDEX_FILE = FRONTEND_DIST / "index.html"
if FRONTEND_DIST.exists() and INDEX_FILE.exists():
    # Mount assets (assumes Vite build output structure)
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")  # SPA fallback
    def spa_fallback(full_path: str):  # noqa: ARG001
        if INDEX_FILE.exists():
            return FileResponse(INDEX_FILE)
        return {"detail": "Not Found"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
