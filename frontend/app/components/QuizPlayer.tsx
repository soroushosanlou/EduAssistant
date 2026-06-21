"use client";

import { useState } from "react";

interface Question {
  question: string;
  options: { A: string; B: string; C: string; D: string };
  answer: string;
  explanation: string;
}

export default function QuizPlayer({ questions }: { questions: Question[] }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));

  const q = questions[current];

  function handleSelect(opt: string) {
    if (revealed) return;
    setSelected(opt);
  }

  function handleSubmit() {
    if (!selected) return;
    const correct = selected === q.answer;
    if (correct) setScore((s) => s + 1);
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    setRevealed(true);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "📚";
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4">
        <div className="text-center">
          <p className="text-4xl mb-2">{emoji}</p>
          <p className="text-xl font-bold text-white">Quiz Complete!</p>
          <p className="text-gray-400 mt-1">
            Score: <span className="text-purple-400 font-bold text-lg">{score}/{questions.length}</span>
            <span className="text-gray-500 ml-2">({pct}%)</span>
          </p>
        </div>
        <div className="space-y-2 mt-4">
          {questions.map((q, i) => {
            const userAns = answers[i];
            const correct = userAns === q.answer;
            return (
              <div key={i} className={`flex items-start gap-2 text-sm p-2 rounded-lg ${correct ? "bg-green-900/30" : "bg-red-900/30"}`}>
                <span>{correct ? "✅" : "❌"}</span>
                <div>
                  <p className="text-gray-300">{q.question}</p>
                  {!correct && (
                    <p className="text-green-400 text-xs mt-0.5">Correct: {q.answer}) {q.options[q.answer as keyof typeof q.options]}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">Question {current + 1} of {questions.length}</span>
        <span className="text-xs text-purple-400 font-medium">Score: {score}</span>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-1.5">
        <div
          className="bg-purple-600 h-1.5 rounded-full transition-all"
          style={{ width: `${((current) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-white font-medium text-sm leading-relaxed">{q.question}</p>

      <div className="space-y-2">
        {(Object.entries(q.options) as [string, string][]).map(([key, val]) => {
          let cls = "border border-gray-700 bg-gray-800 text-gray-300 hover:border-purple-500 hover:text-white";
          if (revealed) {
            if (key === q.answer) cls = "border border-green-500 bg-green-900/40 text-green-300";
            else if (key === selected) cls = "border border-red-500 bg-red-900/40 text-red-300";
            else cls = "border border-gray-700 bg-gray-800 text-gray-500";
          } else if (key === selected) {
            cls = "border border-purple-500 bg-purple-900/40 text-white";
          }
          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${cls}`}
            >
              <span className="font-bold mr-2">{key})</span>{val}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs text-gray-400">
          💡 {q.explanation}
        </div>
      )}

      <div className="flex justify-end">
        {!revealed ? (
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 px-5 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            {current + 1 >= questions.length ? "See Results →" : "Next →"}
          </button>
        )}
      </div>
    </div>
  );
}
