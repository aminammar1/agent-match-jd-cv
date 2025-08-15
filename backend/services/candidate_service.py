from agents.cv_parser_agent import parse_cv
from agents.matching_cv_jd_agent import match_cv_jd
from agents.scheduler_agent import send_interview_email

async def parse_candidate_cv(cv_content: bytes) -> dict:
    return await parse_cv(cv_content)

async def match_candidate_with_job(candidate_data: dict, jd_summary: dict) -> dict:
    result = await match_cv_jd(jd_summary, candidate_data)
    return {
        "match_score": result["match_score"],
        "details": result.get("details", {}),
        "analysis": result.get("analysis", "")
    }

async def send_interview_invitation(email: str, candidate_name: str, match_score: float) -> dict:
    if match_score > 80:
        await send_interview_email(email, candidate_name)
        return {"message": "Interview email sent"}
    else:
        return {"message": "Match score is too low"}
