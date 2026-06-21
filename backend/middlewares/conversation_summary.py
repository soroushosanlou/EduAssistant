import os
from langchain_openai import ChatOpenAI

SUMMARY_THRESHOLD = 10  # summarize after this many messages


def _get_llm():
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0,
        base_url="https://api.metisai.ir/openai/v1",
        api_key=os.getenv("OPENAI_API_KEY"),
    )


def should_summarize(messages: list) -> bool:
    return len(messages) >= SUMMARY_THRESHOLD


def summarize_conversation(messages: list) -> str:
    """Summarize conversation history into a compact context string."""
    conversation_text = ""
    for msg in messages:
        role = msg.get("role", "unknown")
        content = msg.get("content", "")[:500]
        conversation_text += f"{role.upper()}: {content}\n\n"

    prompt = f"""Summarize this conversation between a student and an educational assistant.
Focus on:
- What topics were covered
- What the student learned
- Student's current level and interests
- Any pending questions

Keep it under 200 words.

Conversation:
{conversation_text}"""

    llm = _get_llm()
    return llm.invoke(prompt).content


def apply_summary_middleware(messages: list, existing_summary: str = "") -> tuple[list, str]:
    """
    If conversation is too long, summarize older messages.
    Returns (trimmed_messages, new_summary).
    """
    if not should_summarize(messages):
        return messages, existing_summary

    # Keep last 4 messages fresh, summarize the rest
    older = messages[:-4]
    recent = messages[-4:]

    new_summary = summarize_conversation(older)
    if existing_summary:
        new_summary = f"Previous summary: {existing_summary}\n\nUpdate: {new_summary}"

    return recent, new_summary
