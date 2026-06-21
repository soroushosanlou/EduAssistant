import Link from "next/link";

const FEATURES = [
  {
    icon: "🧠",
    title: "Interactive Quiz",
    desc: "5-question adaptive quizzes with instant feedback, explanations, and scoring based on your level.",
  },
  {
    icon: "💻",
    title: "Code Generator",
    desc: "Get real, runnable code examples with line-by-line explanations tailored to your skill level.",
  },
  {
    icon: "🗺️",
    title: "Learning Roadmap",
    desc: "Personalized step-by-step roadmaps for any career path — Backend, Frontend, DevOps and more.",
  },
  {
    icon: "🔍",
    title: "GitHub Reviewer",
    desc: "Paste any public GitHub repo URL and get a detailed code review with improvement suggestions.",
  },
  {
    icon: "📺",
    title: "YouTube Search",
    desc: "Find the best tutorial videos on any topic, filtered by your experience level.",
  },
];

const STEPS = [
  { step: "1", title: "Choose your level", desc: "Beginner, Intermediate, or Advanced" },
  { step: "2", title: "Pick a tool", desc: "Quiz, Code, Roadmap, GitHub, or YouTube" },
  { step: "3", title: "Learn interactively", desc: "Get personalized responses in real time" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-bold text-purple-400">🎓 EduAssistant</span>
          <Link
            href="/chat"
            className="bg-purple-600 hover:bg-purple-500 transition-colors px-5 py-2 rounded-xl text-sm font-medium"
          >
            Start Learning →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-28 px-6">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-700/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-purple-900/40 border border-purple-700/50 text-purple-300 text-xs px-4 py-1.5 rounded-full">
            ✨ Powered by GPT-4o-mini + LangChain
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
            Your AI-Powered
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Programming Tutor
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Learn programming at your own pace. Get quizzes, code examples, learning roadmaps, GitHub reviews, and tutorial videos — all personalized to your level.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/chat"
              className="bg-purple-600 hover:bg-purple-500 transition-all px-8 py-4 rounded-2xl text-base font-semibold shadow-lg shadow-purple-900/40 hover:shadow-purple-700/40"
            >
              Start Learning for Free →
            </Link>
            <a
              href="#features"
              className="bg-gray-800 hover:bg-gray-700 transition-colors px-8 py-4 rounded-2xl text-base font-medium text-gray-300"
            >
              See Features
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">Everything you need to learn</h2>
            <p className="text-gray-500">5 powerful tools, one intelligent assistant</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-gray-900 border border-gray-800 hover:border-purple-700/60 rounded-2xl p-6 space-y-3 transition-colors group"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}

            {/* CTA card */}
            <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/30 border border-purple-700/40 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-2xl font-bold text-white">Ready to start?</p>
                <p className="text-sm text-gray-400 mt-2">No signup required. Just choose your level and go.</p>
              </div>
              <Link
                href="/chat"
                className="bg-purple-600 hover:bg-purple-500 transition-colors px-5 py-3 rounded-xl text-sm font-semibold text-center"
              >
                Open Chat →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">How it works</h2>
            <p className="text-gray-500">Three steps to start learning</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.step} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-700/30 border border-purple-600/50 flex items-center justify-center text-xl font-bold text-purple-300 mx-auto">
                  {s.step}
                </div>
                <h3 className="font-semibold text-white">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Start your learning journey</h2>
          <p className="text-gray-500">Ask anything about programming. Get smart, personalized answers.</p>
          <Link
            href="/chat"
            className="inline-block bg-purple-600 hover:bg-purple-500 transition-all px-10 py-4 rounded-2xl text-base font-semibold shadow-lg shadow-purple-900/40"
          >
            Open EduAssistant →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6 text-center text-xs text-gray-600">
        🎓 EduAssistant — Built with FastAPI · LangChain · Next.js
      </footer>

    </div>
  );
}
