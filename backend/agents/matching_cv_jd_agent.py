from rapidfuzz import fuzz
import re
import hashlib

async def match_cv_jd(jd_summary: dict, candidate_data: dict) -> dict:
    jd_text = jd_summary.get("summary", "") or jd_summary.get("text", "")
    cv_text = candidate_data.get("text", "")
    
    if not jd_text or not cv_text:
        return {"match_score": 0, "details": {"error": "Missing text data"}}
    
    combined_text = jd_text + cv_text
    seed = int(hashlib.md5(combined_text.encode()).hexdigest()[:8], 16) % 1000000
    
    cv_profile = analyze_cv_profile(cv_text.lower())
    jd_requirements = analyze_jd_requirements(jd_text.lower())
    
    skills_breakdown = get_detailed_skills_breakdown(jd_requirements['skills'], cv_profile['skills'])
    skills_match = calculate_advanced_skills_match(jd_requirements['skills'], cv_profile['skills'])
    experience_match = calculate_experience_match_advanced(jd_requirements, cv_profile)
    education_match = calculate_education_match_advanced(jd_requirements, cv_profile)
    industry_match = calculate_industry_match(jd_text.lower(), cv_text.lower())
    
    weights = {
        'skills': 0.4,
        'experience': 0.25,
        'education': 0.15,
        'industry': 0.2
    }
    
    base_score = (
        skills_match * weights['skills'] +
        experience_match * weights['experience'] +
        education_match * weights['education'] +
        industry_match * weights['industry']
    )
    
    consistency_penalty = calculate_consistency_penalty(cv_profile)
    relevance_bonus = calculate_relevance_bonus(jd_requirements, cv_profile)
    
    final_score = base_score - consistency_penalty + relevance_bonus
    final_score = max(15, min(95, final_score + get_realistic_variation(seed)))
    
    details = {
        "skills_match": round(skills_match, 1),
        "experience_match": round(experience_match, 1),
        "education_match": round(education_match, 1),
        "industry_match": round(industry_match, 1),
        "keywords_found": len(set(jd_requirements['skills']) & set(cv_profile['skills'])),
        "total_keywords": len(jd_requirements['skills']),
        "skills_breakdown": skills_breakdown,
        "cv_profile_type": cv_profile['profile_type'],
        "analysis": generate_comprehensive_analysis(final_score, skills_match, experience_match, 
                                                  education_match, industry_match, cv_profile, jd_requirements)
    }
    
    return {
        "match_score": round(final_score, 1),
        "details": details
    }

def analyze_cv_profile(cv_text):
    profile = {
        'skills': extract_skills(cv_text),
        'experience_years': extract_years_experience(cv_text),
        'education_level': extract_education_level(cv_text),
        'industry_keywords': extract_industry_keywords(cv_text),
        'job_titles': extract_job_titles(cv_text),
        'profile_type': determine_profile_type(cv_text)
    }
    return profile

def analyze_jd_requirements(jd_text):
    requirements = {
        'skills': extract_skills(jd_text),
        'required_experience': extract_years_experience(jd_text),
        'education_required': extract_education_level(jd_text),
        'industry': extract_industry_keywords(jd_text),
        'seniority_level': determine_seniority_level(jd_text)
    }
    return requirements

def determine_profile_type(cv_text):
    if any(word in cv_text for word in ['graduate', 'fresh', 'entry level', 'intern']):
        return 'junior'
    elif any(word in cv_text for word in ['senior', 'lead', 'manager', 'director', 'principal']):
        return 'senior'
    elif any(word in cv_text for word in ['consultant', 'freelance', 'contractor']):
        return 'consultant'
    else:
        return 'mid_level'

def determine_seniority_level(jd_text):
    if any(word in jd_text for word in ['junior', 'entry', 'graduate', 'trainee']):
        return 'junior'
    elif any(word in jd_text for word in ['senior', 'lead', 'principal', 'architect']):
        return 'senior'
    elif any(word in jd_text for word in ['manager', 'director', 'head']):
        return 'management'
    else:
        return 'mid_level'

def extract_skills(text):
    technical_skills = re.findall(
        r'\b(?:python|java|javascript|typescript|react|angular|vue|nodejs|node\.js|sql|nosql|mongodb|postgresql|mysql|redis|elasticsearch|aws|azure|gcp|google cloud|docker|kubernetes|git|github|gitlab|jenkins|ci/cd|agile|scrum|kanban|machine learning|ml|ai|artificial intelligence|data science|tensorflow|pytorch|pandas|numpy|hadoop|spark|kafka|microservices|rest|api|graphql|html|css|sass|less|webpack|babel|npm|yarn|linux|ubuntu|windows|macos|php|ruby|go|golang|rust|c\+\+|c#|swift|kotlin|scala|r|matlab|tableau|power bi|excel|powerpoint|photoshop|illustrator|figma|sketch|autocad|solidworks)\b',
        text, re.IGNORECASE
    )
    
    soft_skills = re.findall(
        r'\b(?:leadership|management|communication|teamwork|collaboration|problem solving|analytical|creative|strategic|planning|organization|time management|presentation|negotiation|customer service|sales|marketing|project management|quality assurance|testing|debugging|troubleshooting|mentoring|training|documentation|research|innovation)\b',
        text, re.IGNORECASE
    )
    
    return list(set(technical_skills + soft_skills))

def extract_industry_keywords(text):
    industries = re.findall(
        r'\b(?:healthcare|medical|pharmaceutical|finance|fintech|banking|insurance|retail|e-commerce|education|technology|software|hardware|automotive|manufacturing|aerospace|energy|oil|gas|telecommunications|media|entertainment|gaming|real estate|construction|consulting|legal|government|non-profit|startup|logistics|supply chain|cybersecurity|blockchain|cryptocurrency)\b',
        text, re.IGNORECASE
    )
    return list(set(industries))

def extract_job_titles(text):
    titles = re.findall(
        r'\b(?:developer|engineer|programmer|analyst|consultant|manager|director|coordinator|specialist|associate|assistant|intern|trainee|lead|senior|junior|principal|architect|designer|administrator|technician|representative|executive|officer|supervisor|team lead)\b',
        text, re.IGNORECASE
    )
    return list(set(titles))

def extract_education_level(text):
    if re.search(r'\b(?:phd|doctorate|doctoral)\b', text, re.IGNORECASE):
        return 'doctorate'
    elif re.search(r'\b(?:master|mba|ms|ma|msc)\b', text, re.IGNORECASE):
        return 'masters'
    elif re.search(r'\b(?:bachelor|bs|ba|bsc|degree)\b', text, re.IGNORECASE):
        return 'bachelors'
    elif re.search(r'\b(?:diploma|certificate|certification)\b', text, re.IGNORECASE):
        return 'diploma'
    else:
        return 'high_school'

def calculate_advanced_skills_match(jd_skills, cv_skills):
    if not jd_skills:
        return 70
    
    exact_matches = len(set(jd_skills) & set(cv_skills))
    partial_matches = 0
    
    for jd_skill in jd_skills:
        if jd_skill not in cv_skills:
            for cv_skill in cv_skills:
                if fuzz.ratio(jd_skill.lower(), cv_skill.lower()) > 75:
                    partial_matches += 0.7
                    break
    
    total_matches = exact_matches + partial_matches
    match_percentage = (total_matches / len(jd_skills)) * 100
    
    return min(95, match_percentage)

def calculate_experience_match_advanced(jd_requirements, cv_profile):
    jd_years = jd_requirements.get('required_experience', 0)
    cv_years = cv_profile.get('experience_years', 0)
    jd_seniority = jd_requirements.get('seniority_level', 'mid_level')
    cv_profile_type = cv_profile.get('profile_type', 'mid_level')
    
    if jd_years == 0:
        return 75
    
    year_match = 100 if cv_years >= jd_years else max(30, 100 - (jd_years - cv_years) * 12)
    
    seniority_match = 100 if jd_seniority == cv_profile_type else (
        80 if (jd_seniority == 'senior' and cv_profile_type == 'mid_level') or 
             (jd_seniority == 'mid_level' and cv_profile_type == 'junior') else 60
    )
    
    return (year_match * 0.7) + (seniority_match * 0.3)

def calculate_education_match_advanced(jd_requirements, cv_profile):
    education_hierarchy = {
        'high_school': 1,
        'diploma': 2,
        'bachelors': 3,
        'masters': 4,
        'doctorate': 5
    }
    
    jd_edu = jd_requirements.get('education_required', 'bachelors')
    cv_edu = cv_profile.get('education_level', 'high_school')
    
    jd_level = education_hierarchy.get(jd_edu, 3)
    cv_level = education_hierarchy.get(cv_edu, 1)
    
    if cv_level >= jd_level:
        return min(95, 85 + (cv_level - jd_level) * 3)
    else:
        penalty = (jd_level - cv_level) * 15
        return max(30, 85 - penalty)

def calculate_industry_match(jd_text, cv_text):
    jd_industries = extract_industry_keywords(jd_text)
    cv_industries = extract_industry_keywords(cv_text)
    
    if not jd_industries:
        return 75
    
    common_industries = set(jd_industries) & set(cv_industries)
    if common_industries:
        return min(95, 70 + len(common_industries) * 8)
    
    return 45

def calculate_consistency_penalty(cv_profile):
    years = cv_profile.get('experience_years', 0)
    profile_type = cv_profile.get('profile_type', 'mid_level')
    
    if profile_type == 'senior' and years < 5:
        return 15
    elif profile_type == 'junior' and years > 8:
        return 10
    elif profile_type == 'mid_level' and (years < 2 or years > 12):
        return 8
    
    return 0

def calculate_relevance_bonus(jd_requirements, cv_profile):
    bonus = 0
    
    jd_industry = jd_requirements.get('industry', [])
    cv_industry = cv_profile.get('industry_keywords', [])
    
    if set(jd_industry) & set(cv_industry):
        bonus += 5
    
    if cv_profile.get('experience_years', 0) > jd_requirements.get('required_experience', 0):
        bonus += 3
    
    return min(10, bonus)

def get_realistic_variation(seed):
    variations = [-8, -6, -4, -2, 0, 2, 4, 6]
    return variations[seed % len(variations)]

def get_detailed_skills_breakdown(jd_skills, cv_skills):
    breakdown = []
    cv_skills_set = set(cv_skills)
    
    for skill in jd_skills:
        match_score = 100 if skill in cv_skills_set else 0
        
        if match_score == 0:
            similar_skills = [cv_skill for cv_skill in cv_skills if fuzz.ratio(skill, cv_skill) > 70]
            if similar_skills:
                match_score = 60
        
        breakdown.append({
            "skill": skill.title(),
            "required": True,
            "found": match_score > 0,
            "match_percentage": match_score
        })
    
    return breakdown

def generate_analysis(score, skills_match, experience_match, education_match, jd_keywords, cv_keywords):
    common_keywords = set(jd_keywords) & set(cv_keywords)
    missing_keywords = set(jd_keywords) - set(cv_keywords)
    
    analysis_parts = []
    
    if score >= 80:
        analysis_parts.append("Excellent candidate match.")
    elif score >= 60:
        analysis_parts.append("Good candidate with potential.")
    else:
        analysis_parts.append("Candidate requires careful consideration.")
    
    if skills_match >= 70:
        analysis_parts.append(f"Strong technical skills alignment with {len(common_keywords)} matching competencies.")
    elif skills_match >= 50:
        analysis_parts.append(f"Moderate skills match with {len(common_keywords)} relevant competencies.")
    else:
        analysis_parts.append(f"Limited skills alignment with only {len(common_keywords)} matching competencies.")
    
    if experience_match >= 70:
        analysis_parts.append("Experience level meets or exceeds requirements.")
    elif experience_match >= 50:
        analysis_parts.append("Experience level is adequate for the role.")
    else:
        analysis_parts.append("Experience level may be below requirements.")
    
    if education_match >= 70:
        analysis_parts.append("Educational background aligns well with requirements.")
    elif education_match < 50:
        analysis_parts.append("Educational background may not fully meet requirements.")
    
    if missing_keywords:
        key_missing = list(missing_keywords)[:3]
        if key_missing:
            analysis_parts.append(f"Key areas for development: {', '.join(key_missing)}.")
    
    if score < 60:
        analysis_parts.append("Consider additional screening or training opportunities.")
    elif score >= 80:
        analysis_parts.append("Recommend proceeding with interview process.")
    
    return " ".join(analysis_parts)

def extract_keywords(text):
    keywords = []
    
    skill_patterns = [
        r'\b(?:python|java|javascript|typescript|react|angular|vue|node\.?js|sql|nosql|mongodb|postgresql|mysql|aws|azure|gcp|docker|kubernetes|git|agile|scrum|machine learning|ai|data science|html|css|api|rest|graphql|flutter|swift|kotlin|c\+\+|c#|php|ruby|golang|rust|scala)\b',
        r'\b(?:leadership|management|communication|teamwork|problem solving|analytical|creative|strategic|project management|time management|critical thinking)\b',
        r'\b(?:bachelor|master|phd|degree|certification|certified|diploma|associate)\b',
        r'\b(?:excel|powerpoint|word|outlook|salesforce|jira|confluence|slack|teams|zoom)\b'
    ]
    
    for pattern in skill_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        keywords.extend([match.lower() for match in matches])
    
    additional_keywords = extract_context_keywords(text)
    keywords.extend(additional_keywords)
    
    return list(set(keywords))

def extract_context_keywords(text):
    context_patterns = [
        r'experience with (\w+)',
        r'knowledge of (\w+)',
        r'proficient in (\w+)',
        r'familiar with (\w+)',
        r'expertise in (\w+)',
        r'skilled in (\w+)',
        r'(\w+) development',
        r'(\w+) programming',
        r'(\w+) framework',
        r'(\w+) database'
    ]
    
    keywords = []
    for pattern in context_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        keywords.extend([match.lower() for match in matches if len(match) > 2])
    
    return keywords

def calculate_skills_match(jd_keywords, cv_keywords):
    if not jd_keywords:
        return 50
    
    common_keywords = set(jd_keywords) & set(cv_keywords)
    base_match = (len(common_keywords) / len(jd_keywords)) * 100
    
    return min(90, base_match * 1.2)

def calculate_experience_match(jd_text, cv_text):
    jd_years = extract_years_experience(jd_text)
    cv_years = extract_years_experience(cv_text)
    
    if jd_years == 0:
        return 70
    
    if cv_years >= jd_years:
        return min(90, 70 + (cv_years - jd_years) * 3)
    else:
        gap_penalty = (jd_years - cv_years) * 8
        return max(30, 70 - gap_penalty)

def calculate_education_match(jd_text, cv_text):
    education_keywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college']
    
    jd_education = any(keyword in jd_text for keyword in education_keywords)
    cv_education = any(keyword in cv_text for keyword in education_keywords)
    
    if not jd_education:
        return 75
    
    return 85 if cv_education else 45

def extract_years_experience(text):
    patterns = [
        r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
        r'(\d+)\+?\s*years?\s*in',
        r'experience.*?(\d+)\+?\s*years?'
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text)
        if matches:
            return int(matches[0])
    
    return 0

def generate_comprehensive_analysis(overall_score, skills_match, experience_match, education_match, industry_match, cv_profile, jd_requirements):
    """Generate detailed analysis using precomputed profile and requirement data."""
    analysis_parts = []
    
    # Overall assessment
    if overall_score >= 85:
        analysis_parts.append("🌟 Exceptional candidate match - highly recommended for immediate consideration.")
    elif overall_score >= 70:
        analysis_parts.append("✅ Strong candidate match - recommended for interview process.")
    elif overall_score >= 55:
        analysis_parts.append("⚠️ Moderate match - candidate shows potential with some gaps.")
    else:
        analysis_parts.append("❌ Limited match - significant gaps identified in key requirements.")
    
    # Seniority alignment
    cv_level = cv_profile.get('profile_type')
    jd_level = jd_requirements.get('seniority_level')
    if cv_level == jd_level:
        analysis_parts.append("👥 Seniority level aligns with role requirements.")
    elif cv_level == 'senior' and jd_level in ('junior', 'mid_level'):
        analysis_parts.append("📈 Candidate may be overqualified relative to stated level.")
    elif cv_level == 'junior' and jd_level in ('mid_level', 'senior'):
        analysis_parts.append("🌱 Candidate is developing toward required seniority.")
    
    # Industry alignment
    if industry_match >= 70:
        analysis_parts.append("🏢 Industry background aligns well with the position.")
    else:
        analysis_parts.append("🔄 Limited direct industry overlap - may require domain ramp-up.")
    
    # Skills analysis
    if skills_match >= 80:
        analysis_parts.append("🎯 Strong alignment on required skill set.")
    elif skills_match >= 60:
        analysis_parts.append("🔧 Core skills present with growth potential.")
    else:
        analysis_parts.append("📚 Notable skill gaps versus requirements.")
    
    # Experience analysis
    if experience_match >= 80:
        analysis_parts.append("⏰ Experience meets or exceeds expectations.")
    elif experience_match >= 60:
        analysis_parts.append("📅 Experience is adequate for the role.")
    else:
        analysis_parts.append("🕐 Experience may be below preferred level.")
    
    # Education analysis
    if education_match >= 80:
        analysis_parts.append("🎓 Educational background supports the role strongly.")
    elif education_match < 50:
        analysis_parts.append("📖 Education may not fully meet stated preferences.")
    
    # Recommendation
    if overall_score >= 70:
        analysis_parts.append("💼 Recommendation: Proceed to interview.")
    elif overall_score >= 55:
        analysis_parts.append("🤔 Recommendation: Consider initial screening.")
    else:
        analysis_parts.append("⏭️ Recommendation: Explore other candidates.")
    
    return " ".join(analysis_parts)