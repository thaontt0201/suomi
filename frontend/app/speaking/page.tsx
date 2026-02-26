"use client";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import AudioRecorder from "@/components/AudioRecorder";
import KeskusteluPlayer from "@/components/KeskusteluPlayer";
import ScoreCard from "@/components/ScoreCard";
import { generateSpeakingTask, evaluateSpeaking } from "@/lib/api";
import type { SpeakingTask, SpeakingResult, Level, SpeakingType, SpeakingTopic } from "@/lib/types";

interface Turn {
  question: string;
  instruction: string;
  responseSeconds: number;
}

function parseTurns(prompt: string): Turn[] {
  return prompt.split("\n\n").filter(t => t.startsWith("***")).map(t => {
    const text = t.replace(/^\*\*\*\s*/, "");
    const match = text.match(/^(.*?)\s*\[(.+?)\]$/);
    return {
      question: match ? match[1].trim() : text.trim(),
      instruction: match ? match[2].trim() : "",
      responseSeconds: 25,
    };
  });
}

const TYPES: SpeakingType[] = ["kertominen", "keskustelu", "tilanne", "mielipide"];
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

function getInterviewerLines(prompt: string): string[] {
  return prompt.split("\n\n").filter(t => t.startsWith("***")).map(t => {
    const text = t.replace(/^\*\*\*\s*/, "");
    const match = text.match(/^(.*?)\s*\[(.+?)\]$/);
    return match ? match[1].trim() : text.trim();
  });
}

export default function SpeakingPage() {
  const [level, setLevel] = useState<Level>("B1");
  const [type, setType] = useState<SpeakingType>("kertominen");
  const [topic, setTopic] = useState<SpeakingTopic>("Minä ja taustani");
  const [task, setTask] = useState<SpeakingTask | null>(null);
  const [phase, setPhase] = useState<"setup" | "prep" | "countdown" | "record" | "result">("setup");
  const [prepCountdown, setPrepCountdown] = useState(0);
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  function playKeskusteluTurns(prompt: string) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const lines = getInterviewerLines(prompt);
    if (!lines.length) return;
    setIsSpeaking(true);
    let i = 0;
    function speakNext() {
      if (i >= lines.length) { setIsSpeaking(false); return; }
      const utt = new SpeechSynthesisUtterance(lines[i]);
      utt.lang = "fi-FI";
      utt.rate = 0.85;
      utt.onend = () => { i++; setTimeout(speakNext, 1200); };
      utt.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utt);
    }
    speakNext();
  }

  function stopSpeaking() {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }

  useEffect(() => {
    if (phase !== "countdown") return;
    if (prepCountdown <= 0) { setPhase("record"); return; }
    const t = setTimeout(() => setPrepCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, prepCountdown]);

  const generate = useMutation({
    mutationFn: () => generateSpeakingTask(level, type, topic),
    onSuccess: (data) => { setTask(data); setPhase("prep"); },
  });

  const evaluate = useMutation({
    mutationFn: (fd: FormData) => evaluateSpeaking(fd),
    onSuccess: (data) => { setResult(data); setPhase("result"); },
  });

  return (
    <>
      <Navigation />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Speaking Practice</h1>

        {phase === "setup" && (
          <div className="bg-white rounded-xl border p-6 flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Level</label>
              <div className="flex gap-2">
                {LEVELS.map((l) => (
                  <button key={l} onClick={() => setLevel(l)}
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${level === l ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Task type</label>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button key={t} onClick={() => setType(t)}
                    className={`px-4 py-2 rounded-lg border font-medium capitalize transition-colors ${type === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"}`}>
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
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => generate.mutate()}
              disabled={generate.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {generate.isPending ? "Generating…" : "Generate Task"}
            </button>
          </div>
        )}

        {phase === "prep" && task && (
          <div className="bg-white rounded-xl border p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
            <p className="text-gray-600">{task.instructions}</p>
            <div className="bg-blue-50 rounded-lg p-4">
              {task.task_type === "keskustelu" ? (
                <div className="flex flex-col gap-3">
                  {task.prompt.split("\n\n").filter(Boolean).map((turn, i) => {
                    const isInterviewer = turn.startsWith("***");
                    const text = turn.replace(/^\*\*\*\s*/, "");
                    const match = text.match(/^(.*?)\s*\[(.+?)\]$/);
                    return (
                      <div key={i} className={`rounded-lg p-3 text-sm ${isInterviewer ? "bg-indigo-100 text-indigo-900" : "bg-green-50 text-green-800 border border-green-200"}`}>
                        {isInterviewer ? (
                          <>
                            <span className="font-semibold text-xs text-indigo-500 block mb-1">Haastattelija</span>
                            <p>{match ? match[1] : text}</p>
                            {match && <p className="text-indigo-600 text-xs mt-1 italic">→ {match[2]}</p>}
                          </>
                        ) : (
                          <span className="italic text-green-700">[Sinun vuorosi]</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-blue-900 font-medium whitespace-pre-line">{task.prompt}</p>
              )}
            </div>
            {task.hints.length > 0 && (
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                {task.hints.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            )}
            {task.task_type === "keskustelu" && (
              <button
                onClick={() => isSpeaking ? stopSpeaking() : playKeskusteluTurns(task.prompt)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-colors ${isSpeaking ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"}`}
              >
                {isSpeaking ? "⏹ Stop" : "🔊 Listen to questions (fi)"}
              </button>
            )}
            <p className="text-sm text-gray-400">Preparation time: {task.prep_time_seconds}s</p>
            <button
              onClick={() => {
                if (task.prep_time_seconds > 0) {
                  setPrepCountdown(task.prep_time_seconds);
                  setPhase("countdown");
                } else {
                  setPhase("record");
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Start Recording
            </button>
          </div>
        )}

        {phase === "countdown" && task && (
          <div className="bg-white rounded-xl border p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
              <button
                onClick={() => { setPhase("setup"); setTask(null); }}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors ml-4 shrink-0"
              >
                ✕ Cancel
              </button>
            </div>

            {/* Task still visible during prep */}
            <div className="bg-blue-50 rounded-lg p-4 text-sm">
              <p className="text-blue-900 whitespace-pre-line">{task.prompt}</p>
              {task.hints.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-blue-700 space-y-0.5">
                  {task.hints.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              )}
            </div>

            {/* Circular countdown */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Preparation time</p>
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                  <circle cx="56" cy="56" r="48" stroke="#dbeafe" strokeWidth="8" fill="none" />
                  <circle cx="56" cy="56" r="48" stroke="#3b82f6" strokeWidth="8" fill="none"
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
                onClick={() => setPhase("record")}
                className="text-sm text-blue-500 hover:text-blue-700 underline"
              >
                Skip preparation →
              </button>
            </div>
          </div>
        )}

        {phase === "record" && task && (
          task.task_type === "keskustelu" ? (
            <div className="bg-white rounded-xl border p-6">
              <KeskusteluPlayer
                turns={parseTurns(task.prompt)}
                onComplete={(results) => {
                  const fd = new FormData();
                  results.forEach((r, i) => fd.append("audio", r.blob, `turn_${i}.webm`));
                  fd.append("questions", JSON.stringify(results.map(r => r.question)));
                  fd.append("task_type", "keskustelu");
                  fd.append("level", level);
                  fd.append("task_prompt", task.prompt);
                  evaluate.mutate(fd);
                }}
                onCancel={() => { setPhase("setup"); setTask(null); }}
              />
              {evaluate.isPending && <p className="text-gray-500 text-sm text-center mt-3">Transcribing and evaluating…</p>}
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-6 flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold text-gray-800">{task.title}</h2>
                <button
                  onClick={() => { setPhase("setup"); setTask(null); }}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors ml-4 shrink-0"
                >
                  ✕ Cancel
                </button>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-900 font-medium whitespace-pre-line">{task.prompt}</p>
                {task.hints.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-blue-700 text-sm space-y-0.5">
                    {task.hints.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                )}
              </div>
              <div className="flex flex-col items-center gap-3">
                <AudioRecorder
                  maxSeconds={task.speak_time_seconds}
                  onStop={(blob) => {
                    const fd = new FormData();
                    fd.append("audio", blob, "recording.webm");
                    fd.append("task_type", type);
                    fd.append("level", level);
                    fd.append("task_prompt", task.prompt);
                    evaluate.mutate(fd);
                  }}
                />
                {evaluate.isPending && <p className="text-gray-500 text-sm">Transcribing and evaluating…</p>}
              </div>
            </div>
          )
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
                  {result.feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-orange-600 mb-1">Areas to improve</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {result.feedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
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
            <button onClick={() => { setPhase("setup"); setTask(null); setResult(null); }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
              Practice Again
            </button>
          </div>
        )}
      </main>
    </>
  );
}
