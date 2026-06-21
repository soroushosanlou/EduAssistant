LEVEL_INSTRUCTIONS = {
    "beginner": (
        "The student is a BEGINNER. "
        "Use simple language, avoid jargon, give step-by-step explanations, "
        "include basic examples, be encouraging and patient."
    ),
    "intermediate": (
        "The student is INTERMEDIATE. "
        "Use technical terms, focus on best practices, design patterns, "
        "and real-world usage. Skip basic definitions."
    ),
    "advanced": (
        "The student is ADVANCED. "
        "Go deep into internals, performance, architecture, edge cases, "
        "and production concerns. Be concise and technical."
    ),
}


def apply_student_level(system_prompt: str, level: str) -> str:
    """Inject level-specific instruction into the system prompt."""
    instruction = LEVEL_INSTRUCTIONS.get(level.lower(), LEVEL_INSTRUCTIONS["beginner"])
    return system_prompt + f"\n\nSTUDENT LEVEL INSTRUCTION:\n{instruction}"
