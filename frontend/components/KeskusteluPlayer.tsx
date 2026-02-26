"use client";
import { useState, useEffect, useRef, useCallback } from "react";

interface Turn {
  question: string;
  instruction: string;
  responseSeconds: number;
}

export interface TurnResult {
  question: string;
  blob: Blob;
}

interface Props {
  turns: Turn[];
  onComplete: (results: TurnResult[]) => void;
  onCancel: () => void;
}

export default function KeskusteluPlayer({ turns, onComplete, onCancel }: Props) {
  const [turnIndex, setTurnIndex] = useState(0);
  const [turnPhase, setTurnPhase] = useState<"reading" | "answering">("reading");
  const [countdown, setCountdown] = useState(0);
  const [finished, setFinished] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const currentChunksRef = useRef<Blob[]>([]);
  const collectedRef = useRef<TurnResult[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const cancel = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (recorderRef.current?.state !== "inactive") recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onCancel();
  }, [onCancel]);

  // Acquire microphone on mount
  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
    })();
    return () => {
      window.speechSynthesis?.cancel();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Speak question when entering "reading" phase
  useEffect(() => {
    if (turnPhase !== "reading" || finished) return;
    if (turnIndex >= turns.length) {
      setFinished(true);
      onCompleteRef.current(collectedRef.current);
      return;
    }
    const utt = new SpeechSynthesisUtterance(turns[turnIndex].question);
    utt.lang = "fi-FI";
    utt.rate = 0.85;
    utt.onend = () => {
      setCountdown(turns[turnIndex].responseSeconds);
      setTurnPhase("answering");
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  }, [turnIndex, turnPhase, finished, turns]);

  // Start a fresh recorder for each answering turn
  useEffect(() => {
    if (turnPhase !== "answering" || finished) return;
    const stream = streamRef.current;
    if (!stream) return;
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    currentChunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) currentChunksRef.current.push(e.data);
    };
    recorder.start();
  }, [turnPhase, turnIndex, finished]);

  // Countdown tick — stop recorder and advance when it hits 0
  useEffect(() => {
    if (turnPhase !== "answering" || finished) return;
    if (countdown <= 0) {
      const recorder = recorderRef.current;
      const question = turns[turnIndex]?.question ?? "";
      if (recorder && recorder.state !== "inactive") {
        recorder.onstop = () => {
          const blob = new Blob(currentChunksRef.current, { type: "audio/webm" });
          collectedRef.current = [...collectedRef.current, { question, blob }];
          const next = turnIndex + 1;
          if (next >= turns.length) {
            setFinished(true);
            onCompleteRef.current(collectedRef.current);
          } else {
            setTurnIndex(next);
            setTurnPhase("reading");
          }
        };
        recorder.stop();
      }
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [turnPhase, countdown, turnIndex, turns, finished]);

  const current = turns[turnIndex];
  const pct = countdown > 0 && current ? Math.round((countdown / current.responseSeconds) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">
          Kysymys {Math.min(turnIndex + 1, turns.length)} / {turns.length}
        </span>
        <button onClick={cancel} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
          ✕ Keskeytä
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 justify-center">
        {turns.map((_, i) => (
          <div key={i} className={`h-2.5 w-2.5 rounded-full transition-all ${
            i < turnIndex ? "bg-green-400" :
            i === turnIndex ? "bg-indigo-500 scale-125" :
            "bg-gray-200"
          }`} />
        ))}
      </div>

      {/* Turn display */}
      {!finished && current && (
        turnPhase === "reading" ? (
          <div className="bg-indigo-50 rounded-xl p-6 text-center flex flex-col gap-3">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide animate-pulse">
              🔊 Haastattelija puhuu…
            </p>
            <p className="text-indigo-900 font-medium text-base">{current.question}</p>
            {current.instruction && (
              <p className="text-indigo-500 text-xs italic">→ {current.instruction}</p>
            )}
          </div>
        ) : (
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center gap-3">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
              🎤 Sinun vuorosi — vastaa nyt
            </p>
            {/* Circular countdown */}
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" stroke="#d1fae5" strokeWidth="8" fill="none" />
                <circle cx="48" cy="48" r="40" stroke="#22c55e" strokeWidth="8" fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-green-600">
                {countdown}
              </span>
            </div>
            <p className="text-gray-400 text-xs italic">"{current.question}"</p>
          </div>
        )
      )}

      {finished && (
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <p className="text-blue-700 font-semibold">Kaikki kysymykset vastattu!</p>
          <p className="text-blue-500 text-sm mt-1">Analysoidaan vastauksiasi…</p>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        Ääni nauhoitetaan vastaustesi aikana
      </p>
    </div>
  );
}
