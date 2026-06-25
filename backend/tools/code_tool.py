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
def code_generator(topic: str, level: str = "beginner", student_context: str = "") -> str:
    """Generate educational code examples for a programming topic.

    Args:
        topic: The programming topic to generate code for (e.g. 'FastAPI CRUD', 'React useState')
        level: Student level - beginner, intermediate, or advanced
        student_context: Summary of student profile, known technologies, and studied topics
    """
    level_instructions = {
        "beginner": (
            "Write simple, well-commented code. Explain every step. "
            "Avoid advanced patterns. Use basic language features only."
        ),
        "intermediate": (
            "Include proper error handling, type hints, and follow best practices. "
            "Add comments for non-obvious parts."
        ),
        "advanced": (
            "Include advanced patterns, performance optimizations, edge case handling, "
            "and production-ready code structure."
        ),
    }
    instruction = level_instructions.get(level, level_instructions["beginner"])

    context_section = f"\nStudent Profile:\n{student_context}\nUse their known technologies as analogies where helpful. Don't re-explain concepts they've already studied.\n" if student_context else ""

    prompt = f"""Generate an educational code example for "{topic}" for a {level} level student.
{context_section}
Instructions: {instruction}

Structure your response as:
1. Brief explanation of what the code does
2. The complete code with comments
3. Key points to understand
4. What to try next (one suggestion)

Make it practical and easy to learn from."""

    llm = _get_llm()
    return llm.invoke(prompt).content
