import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  withCredentials: true,
});

// ── Auth ──────────────────────────────────────────────────────────────────
export const getMe = () => api.get("/auth/me").then((r) => r.data);

// ── Speaking ──────────────────────────────────────────────────────────────
export const generateSpeakingTask = (level: string, type: string, topic: string) =>
  api.post("/api/speaking/generate", { level, type, topic }).then((r) => r.data);

export const evaluateSpeaking = (formData: FormData) =>
  api.post("/api/speaking/evaluate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);

// ── Writing ───────────────────────────────────────────────────────────────
export const generateWritingTask = (level: string, writing_type: string, topic: string) =>
  api.post("/api/writing/generate", { level, writing_type, topic }).then((r) => r.data);

export const submitWriting = (text: string, prompt_text: string, level: string) =>
  api.post("/api/writing/submit", { text, prompt_text, level }).then((r) => r.data);

// ── Vocabulary ────────────────────────────────────────────────────────────
export const generateVocabulary = (level: string, theme: string) =>
  api.post("/api/vocabulary/generate", { level, theme }).then((r) => r.data);

export const getFlashcards = () =>
  api.get("/api/vocabulary/flashcards").then((r) => r.data);

export const createFlashcard = (card: {
  word: string; translation: string; example_sentence?: string; synonyms?: string;
}) => api.post("/api/vocabulary/flashcards", card).then((r) => r.data);

export const deleteFlashcard = (id: string) =>
  api.delete(`/api/vocabulary/flashcards/${id}`).then((r) => r.data);

// ── Progress ──────────────────────────────────────────────────────────────
export const getProgressSummary = () =>
  api.get("/api/progress/summary").then((r) => r.data);

export const getHistory = () =>
  api.get("/api/progress/history").then((r) => r.data);
