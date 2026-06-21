import os
import dotenv
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langchain.agents import create_agent
from tools import quiz_generator, code_generator, github_reviewer, roadmap_generator, youtube_search
from middlewares import apply_student_level, ContextManager, apply_summary_middleware

dotenv.load_dotenv()

BASE_SYSTEM_PROMPT = """You are an intelligent programming education assistant.

{student_context}

{summary_context}

You have access to these tools — always use them when appropriate:
- quiz_generator: Create quizzes on programming topics
- code_generator: Generate educational code examples
- github_reviewer: Review GitHub repositories and give feedback
- roadmap_generator: Create personalized learning roadmaps
- youtube_search: Search YouTube for educational tutorial videos on a topic

Always pass the student's level to the tools you use.
Respond in the same language the student uses (Persian or English).

CRITICAL RULE: If a tool returns output that starts with "QUIZ_JSON:", you MUST return that exact string as your entire response — do NOT paraphrase, summarize, or add any text before or after it.
"""

tools = [quiz_generator, code_generator, github_reviewer, roadmap_generator, youtube_search]


class EducationalAgent:
    def __init__(self):
        self.context_manager = ContextManager()
        self.messages_history = []
        self.conversation_summary = ""
        self._agent = self._build_agent()

    def _build_agent(self):
        llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.3,
            base_url="https://api.metisai.ir/openai/v1",
            api_key=os.getenv("OPENAI_API_KEY"),
        )
        return create_agent(
            model=llm,
            tools=tools,
            checkpointer=MemorySaver(),
        )

    def _build_system_prompt(self) -> str:
        student_context = self.context_manager.format_for_prompt()
        summary_context = (
            f"Conversation summary so far:\n{self.conversation_summary}"
            if self.conversation_summary
            else ""
        )
        prompt = BASE_SYSTEM_PROMPT.format(
            student_context=student_context,
            summary_context=summary_context,
        )
        # Apply student level middleware
        level = self.context_manager.get()["level"]
        return apply_student_level(prompt, level)

    def chat(self, user_message: str, thread_id: str = "default") -> str:
        # Update context from user message
        self.context_manager.update_from_message(user_message)

        # Add to history
        self.messages_history.append({"role": "user", "content": user_message})

        # Apply conversation summary middleware
        self.messages_history, self.conversation_summary = apply_summary_middleware(
            self.messages_history, self.conversation_summary
        )

        # Inject updated system prompt as first message
        system_prompt = self._build_system_prompt()
        config = {"configurable": {"thread_id": thread_id}}
        result = self._agent.invoke(
            {"messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ]},
            config=config,
        )
        response = result["messages"][-1].content

        # If agent wrapped the QUIZ_JSON, look only in the last tool message
        # (search only the last 4 messages to avoid picking up old quiz history)
        if not response.startswith("QUIZ_JSON:"):
            for msg in result["messages"][-4:]:
                content = getattr(msg, "content", "")
                if isinstance(content, str) and content.startswith("QUIZ_JSON:"):
                    response = content
                    break

        # Track studied topics from tool usage
        for keyword in ["quiz", "roadmap", "code", "review"]:
            if keyword in user_message.lower():
                topic = user_message.replace(keyword, "").strip()
                self.context_manager.add_studied_topic(topic[:50])

        self.messages_history.append({"role": "assistant", "content": response})
        return response

    def set_level(self, level: str) -> None:
        self.context_manager.set_level(level)

    def get_context(self) -> dict:
        return self.context_manager.get()
