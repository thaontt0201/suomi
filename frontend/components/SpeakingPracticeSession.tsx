"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import AudioRecorder from "@/components/AudioRecorder";
import ScoreCard from "@/components/ScoreCard";
import { evaluateSpeaking } from "@/lib/api";
import type { Level, SpeakingResult, SpeakingTask } from "@/lib/types";

const LEVELS: Level[] = ["A2", "B1", "B2"];

type Phase = "prep" | "countdown" | "record" | "result";

export interface SpeakingPracticeSessionProps {
  task: SpeakingTask;
  level: Level;
  /** When provided, renders level switches that update controlled level via parent. */
  onLevelChange?: (level: Level) => void;
  onCancel: () => void;
  /** After results, “Choose another question” / back to list. */
  onLeaveAfterResult?: () => void;
}

export default function SpeakingPracticeSession({
  task,
  level,
  onLevelChange,
  onCancel,
  onLeaveAfterResult,
}: SpeakingPracticeSessionProps) {
  const [phase, setPhase] = useState<Phase>("prep");
  const [prepCountdown, setPrepCountdown] = useState(0);
  const [result, setResult] = useState<SpeakingResult | null>(null);

  useEffect(() => {
    setPhase("prep");
    setResult(null);
    setPrepCountdown(0);
  }, [task]);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (prepCountdown <= 0) {
      setPhase("record");
      return;
    }
    const t = setTimeout(() => setPrepCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, prepCountdown]);

  const evaluate = useMutation({
    mutationFn: (fd: FormData) => evaluateSpeaking(fd),
    onSuccess: (data) => {
      setResult(data);
      setPhase("result");
    },
  });

  function cancelToParent() {
    setResult(null);
    setPhase("prep");
    onCancel();
  }

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

      {phase === "prep" && (
        <div className="bg-white rounded-xl border p-6 flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
          <p className="text-gray-600">{task.instructions}</p>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-900 font-medium whitespace-pre-line">{task.prompt}</p>
          </div>
          {task.hints.length > 0 && (
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              {task.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
          <p className="text-sm text-gray-400">Preparation time: {task.prep_time_seconds}s</p>
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => {
                if (task.prep_time_seconds > 0) {
                  setPrepCountdown(task.prep_time_seconds);
                  setPhase("countdown");
                } else {
                  setPhase("record");
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Recording
            </button>
            <button
              type="button"
              onClick={cancelToParent}
              className="text-sm text-gray-500 hover:text-red-600 py-3 px-4"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {phase === "countdown" && (
        <div className="bg-white rounded-xl border p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
            <button
              type="button"
              onClick={cancelToParent}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors ml-4 shrink-0"
            >
              ✕ Cancel
            </button>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-sm">
            <p className="text-blue-900 whitespace-pre-line">{task.prompt}</p>
            {task.hints.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-blue-700 space-y-0.5">
                {task.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Preparation time</p>
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="48" stroke="#dbeafe" strokeWidth="8" fill="none" />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 48}`}
                  strokeDashoffset={`${2 * Math.PI * 48 * (1 - prepCountdown / task.prep_time_seconds)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-blue-600">
                {prepCountdown}
              </span>
            </div>
            <p className="text-gray-400 text-xs">Recording starts automatically when time is up</p>
            <button
              type="button"
              onClick={() => setPhase("record")}
              className="text-sm text-blue-500 hover:text-blue-700 underline"
            >
              Skip preparation →
            </button>
          </div>
        </div>
      )}

      {phase === "record" && (
        <div className="bg-white rounded-xl border p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
            <button
              type="button"
              onClick={cancelToParent}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors ml-4 shrink-0"
            >
              ✕ Cancel
            </button>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-900 font-medium whitespace-pre-line">{task.prompt}</p>
            {task.hints.length > 0 && (
              <ul className="mt-2 list-disc list-inside text-blue-700 text-sm space-y-0.5">
                {task.hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col items-center gap-3">
            <AudioRecorder
              maxSeconds={task.speak_time_seconds}
              onStop={(blob) => {
                const fd = new FormData();
                fd.append("audio", blob, "recording.webm");
                fd.append("task_type", task.task_type);
                fd.append("level", level);
                fd.append("task_prompt", task.prompt);
                evaluate.mutate(fd);
              }}
            />
            {evaluate.isPending && <p className="text-gray-500 text-sm">Transcribing and evaluating…</p>}
          </div>
        </div>
      )}

      {phase === "result" && result && (
        <div className="flex flex-col gap-5">
          <ScoreCard score={result.score} levelEstimate={result.levelEstimate} />
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Transcript</h3>
            <p className="text-gray-600 text-sm italic">{result.transcript}</p>
          </div>
          <div className="bg-white rounded-xl border p-6 flex flex-col gap-4">
            <div>
              <h3 className="font-semibold text-green-700 mb-1">Strengths</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {result.feedback.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-orange-600 mb-1">Areas to improve</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {result.feedback.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            {result.feedback.grammarCorrections.length > 0 && (
              <div>
                <h3 className="font-semibold text-red-600 mb-2">Grammar corrections</h3>
                {result.feedback.grammarCorrections.map((c, i) => (
                  <div key={i} className="text-sm bg-red-50 rounded p-3 mb-2">
                    <span className="line-through text-red-400">{c.original}</span>
                    {" → "}
                    <span className="text-green-700 font-medium">{c.corrected}</span>
                    <p className="text-gray-500 mt-1">{c.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
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
                setPhase("prep");
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg"
            >
              Same question again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
