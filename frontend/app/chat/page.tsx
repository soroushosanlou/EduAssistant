"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import QuizPlayer from "../components/QuizPlayer";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
type Level = (typeof LEVELS)[number];

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Context {
  level: string;
  technologies: string[];
  learning_path: string;
  studied_topics: string[];
}

const THREAD_ID = "session-" + Math.random().toString(36).slice(2);

const QUICK_ACTIONS = [
  {
    label: "🧠 Quiz",
    prompt: "Generate a quiz about ",
    suggestions: ["Python basics", "JavaScript ES6", "React Hooks", "FastAPI", "SQL queries", "Git & GitHub"],
    placeholder: "e.g. Django ORM, TypeScript...",
  },
  {
    label: "💻 Code",
    prompt: "Generate a code example for ",
    suggestions: ["REST API with FastAPI", "React useState", "Python class", "SQL JOIN", "JWT Auth", "Docker setup"],
    placeholder: "e.g. async functions, decorators...",
  },
  {
    label: "🗺️ Roadmap",
    prompt: "Create a roadmap for ",
    suggestions: ["Backend Developer", "Frontend Developer", "Data Scientist", "DevOps Engineer", "Full Stack"],
    placeholder: "e.g. Mobile Developer, ML Engineer...",
  },
  {
    label: "🔍 GitHub",
    prompt: "Review this repository: ",
    suggestions: [
      "https://github.com/tiangolo/fastapi",
      "https://github.com/django/django",
      "https://github.com/pallets/flask",
      "https://github.com/encode/httpx",
    ],
    placeholder: "https://github.com/user/repo",
  },
  {
    label: "📺 YouTube",
    prompt: "Find videos for ",
    suggestions: ["Python for beginners", "FastAPI tutorial", "React crash course", "Docker & Kubernetes", "Machine Learning"],
    placeholder: "e.g. Next.js, LangChain...",
  },
];

type QuickAction = (typeof QUICK_ACTIONS)[number];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState<Level>("beginner");
  const [context, setContext] = useState<Context | null>(null);
  const [activeAction, setActiveAction] = useState<QuickAction | null>(null);
  const [customTopic, setCustomTopic] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (activeAction) {
      setCustomTopic("");
      setTimeout(() => customInputRef.current?.focus(), 50);
    }
  }, [activeAction]);

  async function sendMessage(overrideMsg?: string) {
    const userMsg = (overrideMsg ?? input).trim();
    if (!userMsg || loading) return;
    setInput("");
    setActiveAction(null);
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, thread_id: THREAD_ID, level }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      setContext(data.context);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ خطا در اتصال به سرور" }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestion(action: QuickAction, topic: string) {
    sendMessage(action.prompt + topic);
  }

  function handleCustomSubmit(action: QuickAction) {
    if (!customTopic.trim()) return;
    sendMessage(action.prompt + customTopic.trim());
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-5 shrink-0">
        <div>
          <Link href="/" className="text-base font-bold text-purple-400 hover:text-purple-300 transition-colors">🎓 EduAssistant</Link>
          <p className="text-xs text-gray-500 mt-0.5">Programming Learning Assistant</p>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wide">Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as Level)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Quick Actions</p>
          <div className="flex flex-col gap-1">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={() => setActiveAction(activeAction?.label === a.label ? null : a)}
                className={`text-left text-xs px-2 py-1.5 rounded-lg transition-colors ${
                  activeAction?.label === a.label
                    ? "bg-purple-800 text-purple-200"
                    : "text-gray-400 hover:text-purple-300 hover:bg-gray-800"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {context && (
          <div className="text-xs space-y-3 border-t border-gray-800 pt-4">
            <p className="text-gray-400 font-medium uppercase tracking-wide">Detected Profile</p>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Level</span>
                <span className="text-green-400 font-medium">{context.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Path</span>
                <span className="text-gray-300 text-right max-w-[100px] truncate">{context.learning_path}</span>
              </div>
            </div>
            {context.technologies.length > 0 && (
              <div>
                <p className="text-gray-500 mb-1">Technologies</p>
                <div className="flex flex-wrap gap-1">
                  {context.technologies.map((t) => (
                    <span key={t} className="bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full text-xs">{t}</span>
                  ))}
                </div>
              </div>
            )}
            {context.studied_topics.length > 0 && (
              <div>
                <p className="text-gray-500 mb-1">Studied</p>
                {context.studied_topics.map((t) => (
                  <p key={t} className="text-gray-400 truncate">• {t}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-5xl mb-4">🎓</p>
              <p className="text-xl font-medium text-gray-300">What would you like to learn?</p>
              <p className="text-sm text-gray-600 mt-1">Quiz • Code • Roadmap • GitHub Review • YouTube</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-purple-700 flex items-center justify-center text-xs shrink-0 mt-1">AI</div>
              )}
              <div
                className={`max-w-2xl px-4 py-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-purple-600 text-white rounded-tr-sm"
                    : "bg-gray-800 text-gray-100 rounded-tl-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  msg.content.startsWith("QUIZ_JSON:") ? (
                    <QuizPlayer questions={JSON.parse(msg.content.replace("QUIZ_JSON:", ""))} />
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none
                      prose-headings:text-purple-300 prose-headings:font-semibold
                      prose-strong:text-white prose-code:text-purple-300
                      prose-code:bg-gray-900 prose-code:px-1 prose-code:rounded
                      prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700
                      prose-li:text-gray-300 prose-p:text-gray-200">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs shrink-0 mt-1">U</div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-purple-700 flex items-center justify-center text-xs shrink-0">AI</div>
              <div className="bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Topic picker panel */}
        {activeAction && (
          <div className="border-t border-gray-800 bg-gray-900 px-6 py-4">
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 font-medium">{activeAction.label} — choose a topic:</p>
                <button onClick={() => setActiveAction(null)} className="text-gray-600 hover:text-gray-400 text-xs">✕ close</button>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-2">
                {activeAction.suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(activeAction, s)}
                    className="bg-gray-800 hover:bg-purple-800 border border-gray-700 hover:border-purple-600 text-gray-300 hover:text-white text-xs px-3 py-1.5 rounded-full transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="flex gap-2">
                <input
                  ref={customInputRef}
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit(activeAction)}
                  placeholder={activeAction.placeholder}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500 transition-colors placeholder-gray-600"
                />
                <button
                  onClick={() => handleCustomSubmit(activeAction)}
                  disabled={!customTopic.trim()}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Go →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-800 bg-gray-950 p-4">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask about programming, request a quiz, review a GitHub repo..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 transition-colors placeholder-gray-600"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-3 rounded-xl text-sm font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
