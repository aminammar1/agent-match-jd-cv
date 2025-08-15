from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

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
    return {"message": "Welcome to the CV Matching JD AI API"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
