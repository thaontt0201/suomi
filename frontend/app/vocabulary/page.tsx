"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { generateVocabulary, getFlashcards, createFlashcard, deleteFlashcard } from "@/lib/api";
import type { Level, Flashcard } from "@/lib/types";

const THEMES = ["arki", "työ", "terveys", "asuminen", "ympäristö", "yhteiskunta"];
const LEVELS: Level[] = ["A2", "B1", "B2"];

export default function VocabularyPage() {
  const [level, setLevel] = useState<Level>("B1");
  const [theme, setTheme] = useState("arki");
  const [tab, setTab] = useState<"generate" | "flashcards">("generate");
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const qc = useQueryClient();

  const generate = useMutation({
    mutationFn: () => generateVocabulary(level, theme),
  });

  const { data: cards } = useQuery<Flashcard[]>({
    queryKey: ["flashcards"],
    queryFn: getFlashcards,
    enabled: tab === "flashcards",
  });

  const saveCard = useMutation({
    mutationFn: (word: { word: string; translation: string; example_sentence?: string; synonyms?: string }) =>
      createFlashcard(word),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["flashcards"] }),
  });

  const removeCard = useMutation({
    mutationFn: deleteFlashcard,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["flashcards"] }),
  });

  return (
    <>
      <Navigation />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Vocabulary Practice</h1>

        <div className="flex gap-2 mb-6">
          {(["generate", "flashcards"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition-colors ${tab === t ? "bg-blue-600 text-white" : "bg-white border text-gray-700 hover:bg-gray-50"}`}>
              {t === "generate" ? "Generate Words" : "My Flashcards"}
            </button>
          ))}
        </div>

        {tab === "generate" && (
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-xl border p-5 flex flex-col gap-4">
              <div className="flex gap-2 flex-wrap">
                {LEVELS.map((l) => (
                  <button key={l} onClick={() => setLevel(l)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${level === l ? "bg-blue-600 text-white border-blue-600" : "text-gray-700 hover:bg-gray-50"}`}>
                    {l}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {THEMES.map((t) => (
                  <button key={t} onClick={() => setTheme(t)}
                    className={`px-3 py-1.5 rounded-lg border text-sm capitalize transition-colors ${theme === t ? "bg-purple-600 text-white border-purple-600" : "text-gray-700 hover:bg-gray-50"}`}>
                    {t}
                  </button>
                ))}
              </div>
              <button onClick={() => generate.mutate()} disabled={generate.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50">
                {generate.isPending ? "Generating…" : "Generate 10 Words"}
              </button>
            </div>

            {generate.data?.words && (
              <div className="grid gap-3">
                {generate.data.words.map((w: { word: string; translation: string; example_sentence?: string; synonyms?: string }, i: number) => (
                  <div key={i} className="bg-white rounded-xl border p-4 flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-800">{w.word}</div>
                      <div className="text-blue-600 text-sm">{w.translation}</div>
                      {w.example_sentence && <div className="text-gray-500 text-sm mt-1 italic">{w.example_sentence}</div>}
                      {w.synonyms && <div className="text-gray-400 text-xs mt-1">Synonyms: {w.synonyms}</div>}
                    </div>
                    <button
                      onClick={() => saveCard.mutate({ word: w.word, translation: w.translation, example_sentence: w.example_sentence, synonyms: w.synonyms })}
                      className="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg ml-4 whitespace-nowrap"
                    >
                      + Save
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "flashcards" && (
          <div className="grid gap-3">
            {!cards?.length && <p className="text-gray-500">No flashcards yet. Generate some words and save them.</p>}
            {cards?.map((card, i) => (
              <div key={card.id}
                className="bg-white rounded-xl border p-4 cursor-pointer"
                onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}>
                <div className="flex justify-between items-start">
                  <div>
                    {!flipped[i] ? (
                      <div className="font-semibold text-gray-800 text-lg">{card.word}</div>
                    ) : (
                      <>
                        <div className="text-blue-600 font-semibold">{card.translation}</div>
                        {card.example_sentence && <p className="text-gray-500 text-sm italic mt-1">{card.example_sentence}</p>}
                      </>
                    )}
                    <div className="text-xs text-gray-400 mt-1">{flipped[i] ? "Click to flip back" : "Click to reveal"}</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeCard.mutate(card.id); }}
                    className="text-red-400 hover:text-red-600 text-sm px-2 py-1">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
