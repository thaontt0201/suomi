"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import ScoreCard from "@/components/ScoreCard";
import { submitWriting } from "@/lib/api";
import type { Level, WritingResult, WritingTask } from "@/lib/types";

const LEVELS: Level[] = ["A2", "B1", "B2"];

export interface WritingPracticeSessionProps {
  task: WritingTask;
  level: Level;
  onLevelChange?: (level: Level) => void;
  onCancel: () => void;
  onLeaveAfterResult?: () => void;
}

export default function WritingPracticeSession({
  task,
  level,
  onLevelChange,
  onCancel,
  onLeaveAfterResult,
}: WritingPracticeSessionProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<WritingResult | null>(null);

  useEffect(() => {
    setText("");
    setResult(null);
  }, [task]);

  const submit = useMutation({
    mutationFn: () => submitWriting(text, task.prompt, level),
    onSuccess: (data) => setResult(data),
  });

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6">
      {onLevelChange && (
        <div className="flex gap-3 flex-wrap">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onLevelChange(l)}
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                level === l
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:text-red-600">
          Back to questions
        </button>
      </div>

      <div className="bg-blue-50 rounded-xl p-5">
        <h2 className="font-semibold text-blue-900 mb-1">{task.title}</h2>
        <p className="text-blue-800 text-sm mb-2">{task.instructions}</p>
        <p className="text-blue-900">{task.prompt}</p>
        <p className="text-xs text-blue-500 mt-2">
          {task.min_words}–{task.max_words} words
        </p>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Kirjoita vastauksesi tähän…"
          className="w-full border rounded-xl p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
        />
        <span
          className={`absolute bottom-3 right-4 text-xs ${
            wordCount < task.min_words ? "text-red-400" : "text-green-500"
          }`}
        >
          {wordCount} / {task.min_words}–{task.max_words} words
        </span>
      </div>

      {!result && (
        <button
          type="button"
          onClick={() => submit.mutate()}
          disabled={submit.isPending || wordCount < 10}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {submit.isPending ? "Evaluating…" : "Submit for Feedback"}
        </button>
      )}

      {result && (
        <div className="flex flex-col gap-4">
          <ScoreCard score={result.score} levelEstimate={result.levelEstimate} />
          <div className="bg-white rounded-xl border p-6 grid grid-cols-2 gap-4 text-sm">
            {Object.entries(result.feedback)
              .filter(([k]) => k !== "corrections")
              .map(([key, val]) => (
                <div key={key}>
                  <div className="font-medium text-gray-700 capitalize">{key}</div>
                  <div className="text-gray-500">{val as string}</div>
                </div>
              ))}
          </div>
          {result.feedback.corrections.length > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-red-600 mb-3">Corrections</h3>
              {result.feedback.corrections.map((c, i) => (
                <div key={i} className="text-sm bg-red-50 rounded p-3 mb-2">
                  <span className="line-through text-red-400">{c.original}</span>
                  {" → "}
                  <span className="text-green-700 font-medium">{c.corrected}</span>
                  <p className="text-gray-500 mt-1">{c.explanation}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3 flex-wrap">
            {onLeaveAfterResult && (
              <button
                type="button"
                onClick={onLeaveAfterResult}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
              >
                Choose another question
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setText("");
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg"
            >
              Revise and resubmit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
