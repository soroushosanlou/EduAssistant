import urllib.parse
from langchain_core.tools import tool


@tool
def youtube_search(query: str, level: str = "beginner") -> str:
    """Generate YouTube search links for educational videos on a programming topic.

    Args:
        query: Programming topic to search (e.g. 'FastAPI Authentication')
        level: Student level - beginner, intermediate, or advanced
    """
    level_suffix = {
        "beginner": "tutorial for beginners",
        "intermediate": "tutorial",
        "advanced": "advanced tutorial",
    }.get(level, "tutorial")

    searches = [
        f"{query} {level_suffix}",
        f"{query} crash course",
        f"{query} full course",
    ]

    lines = [f"📺 **YouTube Search Links for: {query}**\n"]
    for s in searches:
        encoded = urllib.parse.quote(s)
        url = f"https://www.youtube.com/results?search_query={encoded}"
        lines.append(f"- [{s}]({url})")

    lines.append(f"\n🔍 **Direct search:** [Search '{query}' on YouTube](https://www.youtube.com/results?search_query={urllib.parse.quote(query)})")

    return "\n".join(lines)
