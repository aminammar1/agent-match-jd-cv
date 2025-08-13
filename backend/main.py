from fastapi import FastAPI,UploadFile,File,HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import io

# Importing our agents
from agents.cv_parser_agent import parse_cv
from agents.matching_cv_jd_agent import match_cv_jd
from agents.scheduler_agent import send_interview_email
#PDF text extraction 
from PyPDF2 import PdfReader

# Hugging Face summarization model 
from transformers import pipeline

summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn",
    device=0
)

app = FastAPI(title="CV Matching JD AI")

# cors middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the CV Matching JD AI API"}


@app.post("/summarize_jd/")
async def summarize_job_description(jd_file: UploadFile = File(...)):
    """
    Accept a PDF or plain text file containing a job description, extract the text and return a summary via the local Huggin Face model
    """
    data = await jd_file.read()

    # if PDF file 
    if jd_file.content_type == "application/pdf" or jd_file.filename.lower().endswith(".pdf"):
        try:
            reader = PdfReader(io.BytesIO(data))
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"PDF parsing error: {e}")
    else:
        # Otherwise assume text
        text = data.decode("utf-8", errors="ignore")

    text = text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Empty job description")

    #  Summarize with Hugging Face model (max 1024-token limit)
    try:
        outputs = summarizer(
            text,
            max_length=150,
            min_length=40,
            do_sample=False
        )
        summary_text = outputs[0]["summary_text"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {e}")

    return {"summary": summary_text}



@app.post("/parse_cv/")
async def parse_cv_candidate(cv_file: UploadFile = File(...)):
    content = await cv_file.read()
    return await parse_cv(content)


@app.post("/match_cv_jd/")
async def match_cv_with_jd(candidate_data: dict, jd_summary: dict):
    """
    return {
        "match_score": <match_score>
    }
    """
    result = await match_cv_jd(jd_summary, candidate_data)
    return {
        "match_score" : result["match_score"],
    }


@app.post("/send_interview_email/")
async def send_interview_email_endpoint(email: str, candidate_name: str, match_score: float):
    """
    Send an interview email to the candidate if the match score is above a certain threshold.
    """
    if match_score > 80:
        await send_interview_email(email, candidate_name)
        return {"message": "Interview email sent"}
    else:
        return {"message": "Match score is too low"}
    


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )