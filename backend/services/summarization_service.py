import io
import os
import json
import logging
from typing import Optional

import requests
from PyPDF2 import PdfReader
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

HF_API_TOKEN = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACEHUB_API_TOKEN")
HF_SUMMARIZATION_MODEL = os.getenv("HF_SUMMARIZATION_MODEL", "facebook/bart-large-cnn")

INFERENCE_API_URL = f"https://api-inference.huggingface.co/models/{HF_SUMMARIZATION_MODEL}"

session = requests.Session()
session.headers.update({
    "Authorization": f"Bearer {HF_API_TOKEN}" if HF_API_TOKEN else "",
    "Accept": "application/json",
    "User-Agent": "job-match-backend/1.0"
})

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def _call_hf_summarization(text: str, max_length: int, min_length: int) -> Optional[str]:
    if not HF_API_TOKEN:
        logger.warning("HF_TOKEN not set; returning truncated text fallback")
        return None
    payload = {
        "inputs": text,
        "parameters": {
            "max_length": max_length,
            "min_length": min_length,
            "do_sample": False
        },
        "options": {"wait_for_model": True}
    }
    try:
        resp = session.post(INFERENCE_API_URL, json=payload, timeout=60)
    except requests.RequestException as e:
        logger.error(f"HF API request error: {e}")
        return None
    if resp.status_code == 503:
        # Model loading or cold start; try once more after short delay
        try:
            resp = session.post(INFERENCE_API_URL, json=payload, timeout=90)
        except requests.RequestException:
            return None
    if not resp.ok:
        logger.error(f"HF API error {resp.status_code}: {resp.text[:200]}")
        return None
    try:
        data = resp.json()
    except json.JSONDecodeError:
        logger.error("Invalid JSON from HF API")
        return None
    # Possible return formats: list[{'summary_text': '...'}] or error dict
    if isinstance(data, list) and data and isinstance(data[0], dict) and "summary_text" in data[0]:
        return data[0]["summary_text"].strip()
    # Some models may return generated_text instead
    if isinstance(data, list) and data and isinstance(data[0], dict) and "generated_text" in data[0]:
        return data[0]["generated_text"].strip()
    logger.warning(f"Unexpected HF response format: {str(data)[:200]}")
    return None

async def summarize_job_description(file_data: bytes, content_type: str, filename: str) -> dict:
    if content_type == "application/pdf" or filename.lower().endswith(".pdf"):
        try:
            reader = PdfReader(io.BytesIO(file_data))
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"PDF parsing error: {e}")
    else:
        text = file_data.decode("utf-8", errors="ignore")

    text = text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Empty job description")

    text_length = len(text.split())
    
    if text_length > 1000:
        text = " ".join(text.split()[:1000])
    elif text_length < 10:
        return {"summary": text}
    
    try:
        max_length = min(150, max(50, text_length // 2))
        min_length = min(30, max(10, text_length // 6))
        if max_length <= min_length:
            max_length = min_length + 20

        hf_summary = _call_hf_summarization(text, max_length=max_length, min_length=min_length)
        if hf_summary:
            summary_text = hf_summary
        else:
            summary_text = text[:500] + "..." if len(text) > 500 else text
    except Exception as e:
        summary_text = text[:500] + "..." if len(text) > 500 else text

    return {"summary": summary_text}
