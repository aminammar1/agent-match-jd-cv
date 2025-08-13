import aiosmtplib
from email.message import EmailMessage

async def send_interview_email (to_email:str,condidate_name:str) -> str:
    msg = EmailMessage()
    msg["From"] = "ammar.mohammed@gmail.com"
    msg["To"] = to_email
    msg["Subject"] = "Interview Invitation"
    msg.set_content(f"Dear {condidate_name},\n\nYou are invited for an interview.\n\nBest regards,\nCompany HR")

    await aiosmtplib.send(msg, hostname="smtp.gmail.com", port=587, username="your_email@gmail.com", password="your_email_password", start_tls=True)

    return "Email sent successfully"