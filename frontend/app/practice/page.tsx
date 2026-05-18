"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function PracticePage() {
  return (
    <>
      <Navigation />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Practice</h1>
        <p className="text-gray-500 mb-8">Pick a skill, then browse topics and tasks.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/practice/speaking/topics"
            className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow flex gap-4 items-start"
          >
            <span className="text-3xl">🎤</span>
            <div>
              <div className="font-semibold text-gray-800">Speaking</div>
              <div className="text-sm text-gray-500 mt-1">Predefined prompts and recording</div>
            </div>
          </Link>
          <Link
            href="/practice/writing/topics"
            className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow flex gap-4 items-start"
          >
            <span className="text-3xl">✍️</span>
            <div>
              <div className="font-semibold text-gray-800">Writing</div>
              <div className="text-sm text-gray-500 mt-1">Predefined tasks and AI feedback</div>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}
