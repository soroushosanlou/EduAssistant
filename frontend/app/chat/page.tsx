"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import QuizPlayer from "../components/QuizPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

function getThreadId(): string {
  const key = "edu_thread_id";
  let id = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  if (!id) {
    id = "session-" + Math.random().toString(36).slice(2);
    if (typeof window !== "undefined") localStorage.setItem(key, id);
  }
  return id;
}

const THREAD_ID = getThreadId();

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
  const [level, setLevel] = useState<Level>(() => {
    if (typeof window === "undefined") return "beginner";
    return (localStorage.getItem("edu_level") as Level) ?? "beginner";
  });
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
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside style={{width:240,background:"#18181b",padding:12,display:"flex",flexDirection:"column",gap:8,flexShrink:0,boxShadow:"4px 0 24px 0 rgba(0,0,0,0.22)",zIndex:1}}>

        {/* Brand */}
        <div style={{background:"#27272a",border:"1px solid #3f3f46",borderRadius:12,padding:"12px 14px"}}>
          <Link href="/" style={{fontSize:13,fontWeight:700,color:"#fff",textDecoration:"none"}}>
            🎓 EduAssistant
          </Link>
          <p style={{fontSize:11,color:"#fff",marginTop:2}}>Programming Learning Assistant</p>
        </div>

        {/* Level */}
        <div style={{background:"#27272a",border:"1px solid #3f3f46",borderRadius:12,padding:"12px 14px"}}>
          <p style={{fontSize:10,color:"#fff",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>Level</p>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value as Level);
              localStorage.setItem("edu_level", e.target.value);
            }}
            style={{width:"100%",background:"#18181b",border:"1px solid #3f3f46",borderRadius:8,padding:"6px 10px",fontSize:13,color:"#fff",outline:"none",cursor:"pointer"}}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Quick Actions */}
        <div style={{background:"#27272a",border:"1px solid #3f3f46",borderRadius:12,padding:"12px 14px"}}>
          <p style={{fontSize:10,color:"#fff",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8}}>Quick Actions</p>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={() => setActiveAction(activeAction?.label === a.label ? null : a)}
                style={{
                  textAlign:"left",fontSize:13,padding:"7px 8px",borderRadius:8,border:"none",cursor:"pointer",transition:"background 0.15s",
                  background: activeAction?.label === a.label ? "#3f3f46" : "transparent",
                  color: activeAction?.label === a.label ? "#fff" : "#a1a1aa",
                }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Detected Profile */}
        {context && (
          <div style={{background:"#27272a",border:"1px solid #3f3f46",borderRadius:12,padding:"12px 14px",fontSize:11,display:"flex",flexDirection:"column",gap:8}}>
            <p style={{color:"#71717a",textTransform:"uppercase",letterSpacing:"0.05em"}}>Detected Profile</p>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{color:"#fff"}}>Level</span>
                <span style={{color:"#4ade80",fontWeight:500}}>{context.level}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{color:"#fff"}}>Path</span>
                <span style={{color:"#d4d4d8",maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{context.learning_path}</span>
              </div>
            </div>
            {context.technologies.length > 0 && (
              <div>
                <p style={{color:"#fff",marginBottom:6}}>Technologies</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {context.technologies.map((t) => (
                    <span key={t} style={{background:"#3f3f46",border:"1px solid #52525b",color:"#d4d4d8",padding:"2px 8px",borderRadius:6,fontSize:10}}>{t}</span>
                  ))}
                </div>
              </div>
            )}
            {context.studied_topics.length > 0 && (
              <div>
                <p style={{color:"#fff",marginBottom:4}}>Studied</p>
                {context.studied_topics.map((t) => (
                  <p key={t} style={{color:"#a1a1aa",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>• {t}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Messages */}
        <ScrollArea className="flex-1 px-6 py-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <p className="text-5xl mb-4">🎓</p>
              <p className="text-xl font-medium text-foreground">What would you like to learn?</p>
              <p className="text-sm text-muted-foreground mt-1">Quiz • Code • Roadmap • GitHub Review • YouTube</p>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground shrink-0 mt-1">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-2xl px-4 py-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-secondary text-secondary-foreground rounded-tl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    msg.content.startsWith("QUIZ_JSON:") ? (
                      <QuizPlayer
                        questions={JSON.parse(msg.content.replace("QUIZ_JSON:", ""))}
                        onComplete={(score, total, wrongTopics) => {
                          const wrong = wrongTopics.length > 0
                            ? ` I got these wrong: ${wrongTopics.join("; ")}`
                            : "";
                          sendMessage(`I just finished the quiz. My score was ${score}/${total}.${wrong}`);
                        }}
                      />
                    ) : (
                      <div className="prose prose-sm max-w-none
                        prose-headings:text-foreground prose-headings:font-semibold
                        prose-strong:text-foreground prose-p:text-foreground
                        prose-li:text-foreground
                        prose-a:text-blue-600 prose-a:underline prose-a:font-medium
                        prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:rounded
                        prose-pre:bg-muted prose-pre:border prose-pre:border-border">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0 mt-1">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground shrink-0">
                  AI
                </div>
                <div className="bg-secondary px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Topic picker panel */}
        {activeAction && (
          <div className="border-t border-border bg-card px-6 py-4">
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-medium">{activeAction.label} — choose a topic:</p>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground" onClick={() => setActiveAction(null)}>
                  ✕ close
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeAction.suggestions.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs h-7"
                    onClick={() => handleSuggestion(activeAction, s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  ref={customInputRef}
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit(activeAction)}
                  placeholder={activeAction.placeholder}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleCustomSubmit(activeAction)}
                  disabled={!customTopic.trim()}
                >
                  Go →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border bg-background p-4">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask about programming, request a quiz, review a GitHub repo..."
              className="flex-1 h-11"
            />
            <Button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="h-11 px-6"
            >
              Send
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
