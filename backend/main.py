from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
app = FastAPI(title="AI Chatbot API")

# Updated CORS for HTTPS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://localhost:5173",
        "https://connectsphere.local:5173",
        "https://192.168.29.102.nip.io:5173",
        "https://127.0.0.1:5173",
        "https://192.168.29.102.nip.io",
        "https://we-connect-teal.vercel.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    logger.info("Groq client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Groq client: {e}")
    raise

class ChatRequest(BaseModel):
    user_input: str
    max_tokens: int = 1024
    temperature: float = 0.9
    conversation_history: list = []

@app.post("/chat")
async def chat(request: ChatRequest, http_request: Request):
    logger.info(f"Request origin: {http_request.headers.get('origin')}")
    try:
        messages = [
            {
                "role": "system",
                "content": "You are WeBot, a friendly, engaging, and witty AI assistant. Provide concise, relevant, and creative responses. Avoid repeating introductions unless necessary. Respond naturally, incorporating humor or cultural context when appropriate (e.g., reply to 'Namaste' in a culturally aware way). Use the conversation history to maintain context."
            }
        ] + request.conversation_history + [
            {"role": "user", "content": request.user_input}
        ]

        completion = groq_client.chat.completions.create(
            model="llama3-70b-8192",
            messages=messages,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            top_p=1,
            stream=True,
            stop=None,
        )

        def generate():
            updated_history = messages
            response_text = ""
            for chunk in completion:
                content = chunk.choices[0].delta.content or ""
                response_text += content
                yield json.dumps({"response": content}) + "\n"
            updated_history.append({"role": "assistant", "content": response_text})
            yield json.dumps({"updated_history": updated_history}) + "\n"

        return StreamingResponse(generate(), media_type="text/event-stream")
    except Exception as e:
        logger.error(f"Error in /chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "AI Chatbot API is running!"}