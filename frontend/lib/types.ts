export type Level = "A2" | "B1" | "B2";
export type SpeakingType = "kertominen" | "keskustelu" | "tilanne" | "mielipide";
export type SpeakingTopic =
  | "Minä ja taustani"
  | "Koti ja asuminen"
  | "Kauppa ja palvelut"
  | "Kulttuuri"
  | "Matkustaminen"
  | "Terveys ja hyvinvointi"
  | "Työ"
  | "Ympäristö"
  | "Yhteiskunta";
export type WritingType = "informal" | "formal" | "mielipide";

export interface User {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  level_estimate: string | null;
}

export interface SpeakingTask {
  title: string;
  instructions: string;
  prompt: string;
  hints: string[];
  prep_time_seconds: number;
  speak_time_seconds: number;
  task_type: SpeakingType;
  level: Level;
}

export interface SpeakingFeedback {
  strengths: string[];
  improvements: string[];
  grammarCorrections: { original: string; corrected: string; explanation: string }[];
  betterExpressions: { original: string; better: string; explanation: string }[];
}

export interface SpeakingResult {
  score: number;
  levelEstimate: string;
  feedback: SpeakingFeedback;
  transcript: string;
}

export interface WritingTask {
  title: string;
  instructions: string;
  prompt: string;
  min_words: number;
  max_words: number;
  writing_type: WritingType;
  level: Level;
}

export interface WritingResult {
  score: number;
  levelEstimate: string;
  feedback: {
    grammar: string;
    vocabulary: string;
    register: string;
    structure: string;
    cohesion: string;
    taskCompletion: string;
    corrections: { original: string; corrected: string; explanation: string }[];
  };
}

export interface Flashcard {
  id: string;
  word: string;
  translation: string;
  example_sentence: string | null;
  synonyms: string | null;
  difficulty: number;
  next_review: string | null;
  created_at: string;
}

export interface ProgressSummary {
  total_sessions: number;
  speaking: { count: number; avg_score: number; recent_scores: { score: number; type: string; created_at: string }[] };
  writing: { count: number; avg_score: number; recent_scores: { score: number; created_at: string }[] };
  level_estimate: string;
}

export interface HistoryItem {
  id: string;
  skill: string;
  type: string | null;
  score: number | null;
  feedback: Record<string, unknown> | null;
  created_at: string;
}
