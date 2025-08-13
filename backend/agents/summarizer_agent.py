import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env
load_dotenv()

# Create OpenAI client pointing to OpenRouter
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

async def summarize_jd(text: str) -> dict:
    prompt = (
        "Extract key elements from this job description:\n\n"
        + text
        + "\n\nReturn JSON with fields: skills, experience, qualifications, responsibilities."
    )

    resp = await client.chat.completions.create(
        model="openai/gpt-oss-20b:free",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )

    return resp.choices[0].message.content
