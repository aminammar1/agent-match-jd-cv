from rapidfuzz import fuzz

async def match_cv_jd(jd_summary:dict , candidate_data:dict) -> dict:
    """
    Match CV with Job Description using fuzzy matching.
    """
    jd_text = jd_summary.get("text", "")
    cv_text = candidate_data.get("text", "")

    # Calculate match score a [0-100] score
    match_score = fuzz.partial_token_set_ratio(jd_text, cv_text)

    return {
        "match_score": match_score
    }