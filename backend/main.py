from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to your mobile IP during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(req: ChatRequest):
    user_msg = req.message

    # Simulate Groq API response (mocked for testing)
    time.sleep(1)
    return {
        "response": f"Mock response to: '{user_msg}'"
    }
