"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import ScoreCard from "@/components/ScoreCard";
import { generateWritingTask, submitWriting } from "@/lib/api";
import type { WritingTask, WritingResult, Level, WritingType, SpeakingTopic } from "@/lib/types";

const TYPES: { value: WritingType; label: string }[] = [
  { value: "informal", label: "Informal message" },
  { value: "formal", label: "Formal letter/complaint" },
  { value: "mielipide", label: "Opinion text" },
];
const LEVELS: Level[] = ["A2", "B1", "B2"];
const TOPICS: SpeakingTopic[] = [
  "Minä ja taustani",
  "Koti ja asuminen",
  "Kauppa ja palvelut",
  "Kulttuuri",
  "Matkustaminen",
  "Terveys ja hyvinvointi",
  "Työ",
  "Ympäristö",
  "Yhteiskunta",
];

export default function WritingPage() {
  const [level, setLevel] = useState<Level>("B1");
  const [writingType, setWritingType] = useState<WritingType>("informal");
  const [topic, setTopic] = useState<SpeakingTopic>("Minä ja taustani");
  const [task, setTask] = useState<WritingTask | null>(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState<WritingResult | null>(null);

  const generate = useMutation({
    mutationFn: () => generateWritingTask(level, writingType, topic),
    onSuccess: (data) => { setTask(data); setText(""); setResult(null); },
  });

  const submit = useMutation({
    mutationFn: () => submitWriting(text, task!.prompt, level),
    onSuccess: (data) => setResult(data),
  });

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <>
      <Navigation />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Writing Practice</h1>

        <div className="bg-white rounded-xl border p-6 flex flex-col gap-4 mb-6">
          <div className="flex gap-3 flex-wrap">
            {LEVELS.map((l) => (
              <button key={l} onClick={() => setLevel(l)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${level === l ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex gap-3 flex-wrap">
            {TYPES.map((t) => (
              <button key={t.value} onClick={() => setWritingType(t.value)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${writingType === t.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
                {t.label}
              </button>
            ))}
          </div>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value as SpeakingTopic)}
            className="w-full border rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button onClick={() => generate.mutate()} disabled={generate.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50">
            {generate.isPending ? "Generating…" : "New Task"}
          </button>
        </div>

        {task && (
          <div className="flex flex-col gap-4">
            <div className="bg-blue-50 rounded-xl p-5">
              <h2 className="font-semibold text-blue-900 mb-1">{task.title}</h2>
              <p className="text-blue-800 text-sm mb-2">{task.instructions}</p>
              <p className="text-blue-900">{task.prompt}</p>
              <p className="text-xs text-blue-500 mt-2">{task.min_words}–{task.max_words} words</p>
            </div>

            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                placeholder="Kirjoita vastauksesi tähän…"
                className="w-full border rounded-xl p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
              <span className={`absolute bottom-3 right-4 text-xs ${wordCount < task.min_words ? "text-red-400" : "text-green-500"}`}>
                {wordCount} / {task.min_words}–{task.max_words} words
              </span>
            </div>

            <button
              onClick={() => submit.mutate()}
              disabled={submit.isPending || wordCount < 10}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {submit.isPending ? "Evaluating…" : "Submit for Feedback"}
            </button>
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-4 mt-6">
            <ScoreCard score={result.score} levelEstimate={result.levelEstimate} />
            <div className="bg-white rounded-xl border p-6 grid grid-cols-2 gap-4 text-sm">
              {Object.entries(result.feedback).filter(([k]) => k !== "corrections").map(([key, val]) => (
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
          </div>
        )}
      </main>
    </>
  );
}
