from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: str = "openai/gpt-oss-20b"
    temperature: float = 1

@app.get("/")
def root():
    return {"status": "Aether Backend is running"}

@app.post("/chat")
async def chat(request: ChatRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": request.model,
        "messages": [msg.dict() for msg in request.messages],
        "stream": True,
        "temperature": request.temperature,
        "max_tokens": 2048,
    }

    async def generate():
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", GROQ_URL, headers=headers, json=payload) as response:
                if response.status_code != 200:
                    error = await response.aread()
                    yield f"data: {{\"error\": \"{error.decode()}\"}}\n\n"
                    return

                async for chunk in response.aiter_text():
                    yield chunk

    return StreamingResponse(generate(), media_type="text/event-stream")