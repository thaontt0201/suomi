import type { SpeakingTaskKind, WritingTaskKind } from "@/lib/types";

const SPEAKING: Record<SpeakingTaskKind, string> = {
  kertominen: "Kertominen",
  tilanne: "Tilanne",
  mielipide: "Mielipide",
};

const WRITING: Record<WritingTaskKind, string> = {
  informal: "Informal message",
  formal: "Formal letter",
  mielipide: "Opinion text",
};

export function speakingTaskKindLabel(kind: SpeakingTaskKind): string {
  return SPEAKING[kind];
}

export function writingTaskKindLabel(kind: WritingTaskKind): string {
  return WRITING[kind];
}
