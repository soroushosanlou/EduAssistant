import os
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI


def _get_llm():
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.3,
        base_url="https://api.metisai.ir/openai/v1",
        api_key=os.getenv("OPENAI_API_KEY"),
    )


@tool
def roadmap_generator(goal: str, level: str = "beginner") -> str:
    """Generate a personalized learning roadmap for a programming goal.

    Args:
        goal: The learning goal (e.g. 'Backend Developer', 'React Frontend', 'ML Engineer')
        level: Current student level - beginner, intermediate, or advanced
    """
    level_instructions = {
        "beginner": "Start from absolute basics. Include foundational concepts before frameworks.",
        "intermediate": "Skip basics. Focus on advanced topics, architecture, and real-world skills.",
        "advanced": "Focus on specialization, system design, performance, and leadership skills.",
    }
    instruction = level_instructions.get(level, level_instructions["beginner"])

    prompt = f"""Create a detailed learning roadmap for "{goal}" starting from {level} level.

Instructions: {instruction}

Structure the roadmap as:
## Phase 1 - [name] (estimated time)
- Topic 1: brief description
- Topic 2: brief description
...

## Phase 2 - [name] (estimated time)
...

(3-4 phases total)

## Recommended Resources
- List 3-4 specific resources (books, courses, docs)

## First Step
What to start with TODAY (one concrete action)

Make it realistic and actionable."""

    llm = _get_llm()
    return llm.invoke(prompt).content
