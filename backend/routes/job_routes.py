from fastapi import APIRouter, UploadFile, File, HTTPException
from services.summarization_service import summarize_job_description

router = APIRouter()

@router.post("/summarize_jd/")
async def summarize_jd_endpoint(jd_file: UploadFile = File(...)):
    data = await jd_file.read()
    result = await summarize_job_description(data, jd_file.content_type, jd_file.filename)
    return result
