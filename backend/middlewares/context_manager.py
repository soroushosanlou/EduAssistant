import re


class ContextManager:
    """Tracks and updates student profile throughout the conversation."""

    def __init__(self):
        self.context = {
            "level": "beginner",
            "technologies": [],
            "learning_path": "not specified",
            "studied_topics": [],
        }

    def update_from_message(self, message: str) -> None:
        """Extract context clues from user messages and update profile."""
        msg = message.lower()

        # Detect level
        if any(w in msg for w in ["i'm a beginner", "just started", "new to", "don't know"]):
            self.context["level"] = "beginner"
        elif any(w in msg for w in ["intermediate", "i know basics", "familiar with"]):
            self.context["level"] = "intermediate"
        elif any(w in msg for w in ["advanced", "expert", "senior", "i've been coding"]):
            self.context["level"] = "advanced"

        # Detect technologies mentioned
        tech_keywords = [
            "python", "javascript", "typescript", "react", "vue", "angular",
            "fastapi", "django", "flask", "node", "nextjs", "sql", "mongodb",
            "docker", "kubernetes", "git", "aws", "langchain",
        ]
        for tech in tech_keywords:
            if tech in msg and tech not in self.context["technologies"]:
                self.context["technologies"].append(tech)

        # Detect learning path
        paths = {
            "backend": "Backend Developer",
            "frontend": "Frontend Developer",
            "fullstack": "Full Stack Developer",
            "data science": "Data Scientist",
            "machine learning": "ML Engineer",
            "devops": "DevOps Engineer",
        }
        for keyword, path in paths.items():
            if keyword in msg:
                self.context["learning_path"] = path

    def add_studied_topic(self, topic: str) -> None:
        if topic not in self.context["studied_topics"]:
            self.context["studied_topics"].append(topic)

    def set_level(self, level: str) -> None:
        if level in ("beginner", "intermediate", "advanced"):
            self.context["level"] = level

    def get(self) -> dict:
        return self.context.copy()

    def format_for_prompt(self) -> str:
        ctx = self.context
        techs = ", ".join(ctx["technologies"]) if ctx["technologies"] else "not specified"
        topics = ", ".join(ctx["studied_topics"]) if ctx["studied_topics"] else "none yet"
        return (
            f"Student Level: {ctx['level']}\n"
            f"Favorite Technologies: {techs}\n"
            f"Learning Path: {ctx['learning_path']}\n"
            f"Studied Topics: {topics}"
        )
