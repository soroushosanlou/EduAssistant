"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  options: { A: string; B: string; C: string; D: string };
  answer: string;
  explanation: string;
}

export default function QuizPlayer({
  questions,
  onComplete,
}: {
  questions: Question[];
  onComplete?: (score: number, total: number, wrongTopics: string[]) => void;
}) {
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
      const finalAnswers = [...answers];
      finalAnswers[current] = selected;
      const wrongTopics = questions
        .filter((q, i) => finalAnswers[i] !== q.answer)
        .map((q) => q.question.slice(0, 60));
      onComplete?.(score + (selected === q.answer ? 1 : 0), questions.length, wrongTopics);
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
      <Card className="border-border">
        <CardContent className="pt-6 space-y-4">
          <div className="text-center">
            <p className="text-4xl mb-2">{emoji}</p>
            <p className="text-xl font-bold">Quiz Complete!</p>
            <p className="text-muted-foreground mt-1">
              Score:{" "}
              <span className="text-primary font-bold text-lg">{score}/{questions.length}</span>
              <span className="text-muted-foreground ml-2">({pct}%)</span>
            </p>
          </div>
          <div className="space-y-2 mt-4">
            {questions.map((q, i) => {
              const userAns = answers[i];
              const correct = userAns === q.answer;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-2 text-sm p-2 rounded-lg",
                    correct ? "bg-green-900/30" : "bg-red-900/30"
                  )}
                >
                  <span>{correct ? "✅" : "❌"}</span>
                  <div>
                    <p className="text-foreground">{q.question}</p>
                    {!correct && (
                      <p className="text-green-400 text-xs mt-0.5">
                        Correct: {q.answer}) {q.options[q.answer as keyof typeof q.options]}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardContent className="pt-5 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Question {current + 1} of {questions.length}</span>
          <Badge variant="secondary" className="text-xs">Score: {score}</Badge>
        </div>

        <div className="w-full bg-secondary rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${(current / questions.length) * 100}%` }}
          />
        </div>

        <p className="text-foreground font-medium text-sm leading-relaxed">{q.question}</p>

        <div className="space-y-2">
          {(Object.entries(q.options) as [string, string][]).map(([key, val]) => {
            let variant: string;
            if (revealed) {
              if (key === q.answer) variant = "correct";
              else if (key === selected) variant = "wrong";
              else variant = "inactive";
            } else if (key === selected) {
              variant = "selected";
            } else {
              variant = "default";
            }

            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors border",
                  variant === "correct" && "border-green-500 bg-green-900/40 text-green-300",
                  variant === "wrong" && "border-red-500 bg-red-900/40 text-red-300",
                  variant === "inactive" && "border-border bg-secondary text-muted-foreground",
                  variant === "selected" && "border-primary bg-primary/20 text-foreground",
                  variant === "default" && "border-border bg-secondary text-secondary-foreground hover:border-primary hover:text-foreground"
                )}
              >
                <span className="font-bold mr-2">{key})</span>{val}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="bg-muted border border-border rounded-xl p-3 text-xs text-muted-foreground">
            💡 {q.explanation}
          </div>
        )}

        <div className="flex justify-end">
          {!revealed ? (
            <Button onClick={handleSubmit} disabled={!selected} size="sm">
              Submit
            </Button>
          ) : (
            <Button onClick={handleNext} size="sm">
              {current + 1 >= questions.length ? "See Results →" : "Next →"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
