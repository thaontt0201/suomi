"use client";
import { useEffect, useRef, useState } from "react";

interface AudioRecorderProps {
  maxSeconds: number;
  onStop: (blob: Blob) => void;
}

export default function AudioRecorder({ maxSeconds, onStop }: AudioRecorderProps) {
  const [state, setState] = useState<"idle" | "recording" | "done">("idle");
  const [elapsed, setElapsed] = useState(0);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stop() {
    mediaRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRef.current = recorder;
    chunksRef.current = [];
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      onStop(blob);
      stream.getTracks().forEach((t) => t.stop());
      setState("done");
    };
    recorder.start();
    setState("recording");
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((s) => {
        if (s + 1 >= maxSeconds) { stop(); return s + 1; }
        return s + 1;
      });
    }, 1000);
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const remaining = Math.max(0, maxSeconds - elapsed);

  return (
    <div className="flex flex-col items-center gap-4">
      {state === "recording" && (
        <div className="text-4xl font-mono text-red-500">{remaining}s</div>
      )}
      {state === "idle" && (
        <button
          onClick={start}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors"
        >
          Start Recording
        </button>
      )}
      {state === "recording" && (
        <button
          onClick={stop}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-full font-semibold transition-colors"
        >
          Stop
        </button>
      )}
      {state === "done" && (
        <div className="text-green-600 font-semibold">Recording saved. Processing…</div>
      )}
    </div>
  );
}
