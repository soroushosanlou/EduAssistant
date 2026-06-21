import os
import json
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI


def _get_llm():
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.7,
        base_url="https://api.metisai.ir/openai/v1",
        api_key=os.getenv("OPENAI_API_KEY"),
    )


@tool
def quiz_generator(topic: str, level: str = "beginner") -> str:
    """Generate an interactive 5-question quiz based on topic and student level.

    Args:
        topic: The programming topic for the quiz (e.g. 'React Hooks', 'FastAPI')
        level: Student level - beginner, intermediate, or advanced
    """
    level_instructions = {
        "beginner": "Use simple language. Focus on basic concepts and definitions.",
        "intermediate": "Include practical scenarios. Focus on usage patterns and best practices.",
        "advanced": "Include edge cases, performance considerations, and deep technical details.",
    }
    instruction = level_instructions.get(level, level_instructions["beginner"])

    prompt = f"""Create a 5-question multiple-choice quiz about "{topic}" for a {level} level student.

Instructions: {instruction}

Return ONLY a valid JSON array with this exact structure (no extra text):
[
  {{
    "question": "question text",
    "options": {{"A": "...", "B": "...", "C": "...", "D": "..."}},
    "answer": "A",
    "explanation": "brief explanation of why this is correct"
  }}
]

Make questions educational and engaging. Return only the JSON array."""

    llm = _get_llm()
    content = llm.invoke(prompt).content.strip()

    # Clean markdown code blocks if present
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    content = content.strip()

    # Validate JSON
    try:
        questions = json.loads(content)
        return "QUIZ_JSON:" + json.dumps(questions, ensure_ascii=False)
    except json.JSONDecodeError:
        return content
