import os
import logging
import aiosmtplib
from email.message import EmailMessage
from dotenv import load_dotenv

# Load env vars once
load_dotenv()

SMTP_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("EMAIL_PORT", "587"))
SMTP_USER = os.getenv("EMAIL_USER")  # full email address / username
SMTP_PASS = os.getenv("EMAIL_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM", SMTP_USER or "no-reply@example.com")


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


async def send_interview_email(to_email: str, condidate_name: str) -> str:
    """Send a simple interview invitation email.

    Expects the following env vars:
      EMAIL_HOST (default smtp.gmail.com)
      EMAIL_PORT (default 587)
      EMAIL_USER
      EMAIL_PASSWORD
      EMAIL_FROM (optional; defaults to EMAIL_USER)
    """
    msg = EmailMessage()
    msg["From"] = EMAIL_FROM
    msg["To"] = to_email
    msg["Subject"] = "Interview Invitation"
    msg.set_content(
        f"Dear {condidate_name},\n\nYou are invited for an interview.\n\nBest regards,\nCompany HR"
    )

    if not (SMTP_USER and SMTP_PASS):
        return "Email credentials not configured"

    try:
        code, response = await aiosmtplib.send(
            msg,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_USER,
            password=SMTP_PASS,
            start_tls=True,
        )
        logger.info(
            "SMTP send result code=%s response=%s to=%s from=%s", code, response, to_email, EMAIL_FROM
        )
        if str(code).startswith("2"):
            return "Email accepted by SMTP server"
        return f"SMTP responded with code {code}: {response}"
    except Exception as e:  # keep simple
        logger.error("Email send failed: %s", e)
        return f"Email send failed: {e}"