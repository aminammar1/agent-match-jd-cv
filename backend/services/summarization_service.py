import io
from PyPDF2 import PdfReader
from transformers import pipeline
from fastapi import HTTPException
import torch

try:
    device = 0 if torch.cuda.is_available() else -1
    summarizer = pipeline(
        "summarization",
        model="facebook/bart-large-cnn",
        device=device
    )
except Exception as e:
    summarizer = pipeline(
        "summarization",
        model="facebook/bart-large-cnn",
        device=-1
    )

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
        
        outputs = summarizer(
            text,
            max_length=max_length,
            min_length=min_length,
            do_sample=False,
            truncation=True
        )
        
        if outputs and len(outputs) > 0 and "summary_text" in outputs[0]:
            summary_text = outputs[0]["summary_text"]
        else:
            summary_text = text[:500] + "..." if len(text) > 500 else text
            
    except Exception as e:
        summary_text = text[:500] + "..." if len(text) > 500 else text

    return {"summary": summary_text}
