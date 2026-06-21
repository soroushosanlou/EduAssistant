import dotenv
dotenv.load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agent import EducationalAgent

app = FastAPI(title="Educational Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# One agent per session — keyed by thread_id
agents: dict[str, EducationalAgent] = {}


def get_agent(thread_id: str) -> EducationalAgent:
    if thread_id not in agents:
        agents[thread_id] = EducationalAgent()
    return agents[thread_id]


class ChatRequest(BaseModel):
    message: str
    thread_id: str = "default"
    level: str | None = None  # optional override


class ChatResponse(BaseModel):
    response: str
    context: dict


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    agent = get_agent(req.thread_id)
    if req.level:
        agent.set_level(req.level)
    response = agent.chat(req.message, thread_id=req.thread_id)
    return ChatResponse(response=response, context=agent.get_context())


@app.get("/context/{thread_id}")
async def get_context(thread_id: str):
    agent = get_agent(thread_id)
    return {
        "context": agent.get_context(),
        "message_count": len(agent.messages_history),
        "has_summary": bool(agent.conversation_summary),
    }


@app.delete("/session/{thread_id}")
async def clear_session(thread_id: str):
    if thread_id in agents:
        del agents[thread_id]
    return {"status": "cleared"}
