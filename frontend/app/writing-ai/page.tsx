"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import WritingPracticeSession from "@/components/WritingPracticeSession";
import { generateWritingTask } from "@/lib/api";
import type { WritingTask, Level, WritingType, SpeakingTopic } from "@/lib/types";

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

  const generate = useMutation({
    mutationFn: () => generateWritingTask(level, writingType, topic),
    onSuccess: (data) => setTask(data),
  });

  return (
    <>
      <Navigation />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Writing Practice</h1>

        {!task && (
          <div className="bg-white rounded-xl border p-6 flex flex-col gap-4 mb-6">
            <div className="flex gap-3 flex-wrap">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${level === l ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setWritingType(t.value)}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${writingType === t.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                >
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
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => generate.mutate()}
              disabled={generate.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {generate.isPending ? "Generating…" : "New Task"}
            </button>
          </div>
        )}

        {task && (
          <WritingPracticeSession
            task={task}
            level={level}
            onLevelChange={setLevel}
            onCancel={() => setTask(null)}
          />
        )}
      </main>
    </>
  );
}
