"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import {
  topicFromSlug,
  topicSlug,
  getQuestionsForTopicAndKind,
  isSpeakingTaskKind,
} from "@/data/practiceQuestions";

export default function SpeakingQuestionsListPage() {
  const params = useParams();
  const slug = typeof params.topicSlug === "string" ? params.topicSlug : "";
  const taskKindParam = typeof params.taskKind === "string" ? params.taskKind : "";
  const topic = topicFromSlug(slug);
  const taskKindOk = isSpeakingTaskKind(taskKindParam);
  const questions =
    topic && taskKindOk ? getQuestionsForTopicAndKind("speaking", slug, taskKindParam) : [];

  return (
    <>
      <Navigation />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-4 flex flex-wrap gap-x-2 gap-y-1">
          <Link href="/practice" className="hover:text-blue-600">
            Practice
          </Link>
          <span>/</span>
          <Link href="/practice/speaking/topics" className="hover:text-blue-600">
            Speaking
          </Link>
          <span>/</span>
          <Link href={topic ? `/practice/speaking/topics/${slug}/tasks` : "#"} className="hover:text-blue-600">
            {topic ?? "Topic"}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium capitalize">{taskKindParam}</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Questions</h1>
        {!topic || !taskKindOk ? (
          <p className="text-red-600">Invalid topic or task type.</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-500">No questions for this combination.</p>
        ) : (
          <ul className="flex flex-col gap-2 mt-6">
            {questions.map((q) => (
              <li key={q.id}>
                <Link
                  href={`/practice/speaking/topics/${topicSlug(topic)}/tasks/${taskKindParam}/questions/${q.id}`}
                  className="block rounded-xl border bg-white px-4 py-3 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{q.title}</span>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{q.prompt}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
