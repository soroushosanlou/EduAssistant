import os
import base64
import requests
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI


def _get_llm():
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.3,
        base_url="https://api.metisai.ir/openai/v1",
        api_key=os.getenv("OPENAI_API_KEY"),
    )


def _fetch_github_content(repo_url: str) -> dict:
    parts = repo_url.rstrip("/").split("/")
    owner, repo = parts[-2], parts[-1]

    headers = {}
    token = os.getenv("GITHUB_TOKEN")
    if token and token != "your_github_token_here":
        headers["Authorization"] = f"token {token}"

    base = f"https://api.github.com/repos/{owner}/{repo}"
    result = {"owner": owner, "repo": repo, "files": {}, "structure": []}

    readme_resp = requests.get(f"{base}/readme", headers=headers)
    if readme_resp.status_code == 200:
        content = readme_resp.json().get("content", "")
        result["files"]["README"] = base64.b64decode(content).decode("utf-8", errors="ignore")[:3000]

    tree_resp = requests.get(f"{base}/git/trees/HEAD", headers=headers)
    if tree_resp.status_code == 200:
        tree = tree_resp.json().get("tree", [])
        result["structure"] = [f["path"] for f in tree if f["type"] == "blob"][:30]

    return result


@tool
def github_reviewer(repo_url: str, level: str = "beginner", student_context: str = "") -> str:
    """Review a GitHub repository and provide educational feedback.

    Args:
        repo_url: Full GitHub repository URL (e.g. https://github.com/username/project)
        level: Student level - beginner, intermediate, or advanced
        student_context: Summary of student profile, known technologies, and learning path
    """
    try:
        data = _fetch_github_content(repo_url)
    except Exception as e:
        return f"Could not fetch repository: {str(e)}"

    readme = data["files"].get("README", "No README found.")
    structure = "\n".join(data["structure"]) or "Could not fetch file structure."

    level_instructions = {
        "beginner": "Be encouraging. Focus on basic good practices. Keep feedback simple and actionable.",
        "intermediate": "Review code organization, naming, error handling, and design patterns.",
        "advanced": "Review architecture, scalability, security, performance, and production readiness.",
    }
    instruction = level_instructions.get(level, level_instructions["beginner"])

    context_section = f"\nStudent Profile:\n{student_context}\nTailor feedback to their known technologies and learning path.\n" if student_context else ""

    prompt = f"""Review this GitHub repository for a {level} level student.
{context_section}

Repository: {data['owner']}/{data['repo']}

File Structure:
{structure}

README:
{readme}

Review Instructions: {instruction}

Provide feedback in this structure:
## Overall Impression
[2-3 sentences]

## Strengths ✅
- Point 1
- Point 2
- Point 3

## Areas for Improvement 🔧
- Point 1 (with specific suggestion)
- Point 2 (with specific suggestion)
- Point 3 (with specific suggestion)

## Code Quality Score
[X/10] - brief justification

## Next Steps
Top 3 concrete things the student should do to improve this project."""

    llm = _get_llm()
    return llm.invoke(prompt).content
