"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import { topicFromSlug, topicSlug, getTaskKindsForTopic } from "@/data/practiceQuestions";
import { writingTaskKindLabel } from "@/lib/taskKindLabels";

export default function WritingTaskKindsPage() {
  const params = useParams();
  const slug = typeof params.topicSlug === "string" ? params.topicSlug : "";
  const topic = topicFromSlug(slug);
  const kinds = topic ? getTaskKindsForTopic("writing", slug) : [];

  return (
    <>
      <Navigation />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/practice" className="hover:text-blue-600">
            Practice
          </Link>
          <span className="mx-2">/</span>
          <Link href="/practice/writing/topics" className="hover:text-blue-600">
            Writing
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{topic ?? "Topic"}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Task types</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Task types</h1>
        {!topic ? (
          <p className="text-red-600">Unknown topic.</p>
        ) : kinds.length === 0 ? (
          <p className="text-gray-500">No questions for this topic yet.</p>
        ) : (
          <>
            <p className="text-gray-500 mb-6">
              Topic: <span className="font-medium text-gray-800">{topic}</span>
            </p>
            <ul className="flex flex-col gap-2">
              {kinds.map((kind) => (
                <li key={kind}>
                  <Link
                    href={`/practice/writing/topics/${topicSlug(topic)}/tasks/${kind}/questions`}
                    className="block rounded-xl border bg-white px-4 py-3 text-gray-800 font-medium hover:border-purple-300 hover:bg-purple-50/50 transition-colors"
                  >
                    {writingTaskKindLabel(kind)}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </>
  );
}
