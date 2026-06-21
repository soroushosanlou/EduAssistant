import dotenv
dotenv.load_dotenv()

from agent import EducationalAgent

agent = EducationalAgent()

print("=== TEST 1: Context Detection ===")
response = agent.chat("I'm a beginner and I want to learn Python and FastAPI")
print(f"Context after message: {agent.get_context()}")
print()

print("=== TEST 2: Student Level Middleware (Beginner) ===")
response = agent.chat("What is useEffect?")
print(f"AGENT: {response[:400]}...")
print()

print("=== TEST 3: Level Change ===")
agent.set_level("advanced")
response = agent.chat("What is useEffect?")
print(f"AGENT (advanced): {response[:400]}...")
print()

print("=== TEST 4: Quiz Tool with Level ===")
agent.set_level("beginner")
response = agent.chat("Generate a quiz about Python functions")
print(f"AGENT: {response[:300]}...")
print()

print("=== TEST 5: Context Summary ===")
print(f"Final context: {agent.get_context()}")
print(f"Messages in history: {len(agent.messages_history)}")
print(f"Conversation summary: {agent.conversation_summary or 'not yet generated'}")
