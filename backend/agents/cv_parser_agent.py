import io
from PyPDF2 import PdfReader

async def parse_cv(file_bytes: bytes) -> dict:
    """
    Extract and return the complete text from a PDF file, or from plain text if the PDF is unavailable.
    """
    text = ""
    # try PDF
    try:
        reader = PdfReader(io.BytesIO(file_bytes))

        def _page_text(page):
            extractor = getattr(page, "extract_text", None) or getattr(page, "extractText", None)
            return (extractor() if extractor else "") or ""

        text = "\n".join(_page_text(page) for page in reader.pages)
    except Exception:
        text = file_bytes.decode('utf-8', errors='ignore')
    return {"text": text}