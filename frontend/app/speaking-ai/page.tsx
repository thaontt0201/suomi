"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import SpeakingPracticeSession from "@/components/SpeakingPracticeSession";
import { generateSpeakingTask } from "@/lib/api";
import type { SpeakingTask, Level, SpeakingTaskKind, SpeakingTopic } from "@/lib/types";

const TYPES: SpeakingTaskKind[] = ["kertominen", "tilanne", "mielipide"];
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

export default function SpeakingPage() {
  const [level, setLevel] = useState<Level>("B1");
  const [type, setType] = useState<SpeakingTaskKind>("kertominen");
  const [topic, setTopic] = useState<SpeakingTopic>("Minä ja taustani");
  const [task, setTask] = useState<SpeakingTask | null>(null);

  const generate = useMutation({
    mutationFn: () => generateSpeakingTask(level, type, topic),
    onSuccess: (data) => setTask(data),
  });

  return (
    <>
      <Navigation />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Speaking Practice</h1>

        {!task && (
          <div className="bg-white rounded-xl border p-6 flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Level</label>
              <div className="flex gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${level === l ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Task type</label>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-4 py-2 rounded-lg border font-medium capitalize transition-colors ${type === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value as SpeakingTopic)}
                className="w-full border rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => generate.mutate()}
              disabled={generate.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {generate.isPending ? "Generating…" : "Generate Task"}
            </button>
          </div>
        )}

        {task && (
          <SpeakingPracticeSession
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
