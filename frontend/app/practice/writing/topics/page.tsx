"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { getTopicsForSkill, topicSlug } from "@/data/practiceQuestions";

export default function WritingTopicsPage() {
  const topics = getTopicsForSkill("writing");

  return (
    <>
      <Navigation />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/practice" className="hover:text-blue-600">
            Practice
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Writing</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Topics</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Topics</h1>
        <p className="text-gray-500 mb-6">Choose a topic for writing practice.</p>
        <ul className="flex flex-col gap-2">
          {topics.map((topic) => (
            <li key={topic}>
              <Link
                href={`/practice/writing/topics/${topicSlug(topic)}/tasks`}
                className="block rounded-xl border bg-white px-4 py-3 text-gray-800 font-medium hover:border-blue-300 hover:bg-purple-50/50 transition-colors"
              >
                {topic}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
