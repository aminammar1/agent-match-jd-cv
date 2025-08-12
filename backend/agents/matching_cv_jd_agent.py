from rapidfuzz import fuzz

async def match_cv_jd(jd_summary:dict , condidate_data:dict) -> dict:
    """
    Match CV with Job Description using fuzzy matching.
    """
    jd_text = jd_summary.get("text", "")
    cv_text = condidate_data.get("text", "")

    # Calculate similarity score
    similarity_score = fuzz.ratio(jd_text, cv_text)

    return {
        "jd_summary": jd_summary,
        "condidate_data": condidate_data,
        "similarity_score": similarity_score
    }