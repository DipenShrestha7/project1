from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import os
from google.adk.agents import Agent
from google.adk.tools import google_search
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

load_dotenv()

app = FastAPI()

allowed_origins = [
    "http://localhost:5173",
    os.getenv("FRONTEND_URL"),
    os.getenv("NODE_BACKEND_URL")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin for origin in allowed_origins if origin],
    allow_methods=["*"],
    allow_headers=["*"],
)

root_agent = Agent(
    name="search_agent",
    model="gemini-2.5-flash",
    description="A Nepal travel assistant.",
    instruction="""
    You are a Nepal travel assistant.
    Use Google search to answer questions about
    tourist destinations, trekking routes,
    temples, lakes, and cities in Nepal.
    """,
    tools=[google_search]
)

session_service = InMemorySessionService()

runner = Runner(
    agent=root_agent,
    app_name="search_agent",
    session_service=session_service
)

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"
    history: list = Field(default_factory=list)

@app.get("/")
async def home():
    return {"status": "AI backend running"}

@app.post("/chat")
async def chat(req: ChatRequest):
    try:
        try:
            await session_service.create_session(
                app_name="search_agent",
                user_id="user",
                session_id=req.session_id
            )
        except Exception:
            pass

        context_str = ""

        if req.history:
            context_str = "Previous conversation history:\n"
            for msg in req.history:
                role = msg.get("role", "user").upper()
                content_text = msg.get("content", "")
                context_str += f"{role}: {content_text}\n"
            context_str += "\n---\n\nNow, the user is asking:\n"

        full_message = context_str + req.message

        content = types.Content(
            role="user",
            parts=[types.Part(text=full_message)]
        )

        response_text = ""

        async for event in runner.run_async(
            user_id="user",
            session_id=req.session_id,
            new_message=content
        ):
            if event.is_final_response():
                response_text = event.content.parts[0].text
                break

        return {"reply": response_text}

    except Exception as e:
        return {"reply": f"Error: {str(e)}"}