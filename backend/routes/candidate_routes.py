from fastapi import APIRouter, UploadFile, File
from services.candidate_service import parse_candidate_cv, match_candidate_with_job, send_interview_invitation

router = APIRouter()

@router.post("/parse_cv/")
async def parse_cv_endpoint(cv_file: UploadFile = File(...)):
    content = await cv_file.read()
    return await parse_candidate_cv(content)

@router.post("/match_cv_jd/")
async def match_cv_jd_endpoint(candidate_data: dict, jd_summary: dict):
    return await match_candidate_with_job(candidate_data, jd_summary)

@router.post("/send_interview_email/")
async def send_interview_email_endpoint(email: str, candidate_name: str, match_score: float):
    return await send_interview_invitation(email, candidate_name, match_score)
