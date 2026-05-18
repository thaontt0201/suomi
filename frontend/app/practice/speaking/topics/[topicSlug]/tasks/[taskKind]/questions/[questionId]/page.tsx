"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import SpeakingPracticeSession from "@/components/SpeakingPracticeSession";
import {
  getQuestionById,
  speakingTaskFromPractice,
  topicFromSlug,
  isSpeakingTaskKind,
} from "@/data/practiceQuestions";
import type { Level } from "@/lib/types";

const LEVELS: Level[] = ["A2", "B1", "B2"];

function parseLevel(raw: string | null): Level {
  if (raw && (LEVELS as string[]).includes(raw)) return raw as Level;
  return "B1";
}

export default function SpeakingPracticeQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = typeof params.topicSlug === "string" ? params.topicSlug : "";
  const taskKindParam = typeof params.taskKind === "string" ? params.taskKind : "";
  const questionId = typeof params.questionId === "string" ? params.questionId : "";

  const topic = topicFromSlug(slug);
  const taskKindOk = isSpeakingTaskKind(taskKindParam);
  const q = getQuestionById(questionId);

  const resolvedLevel = parseLevel(searchParams.get("level"));
  const [level, setLevel] = useState<Level>(resolvedLevel);

  useEffect(() => {
    setLevel(parseLevel(searchParams.get("level")));
  }, [searchParams]);

  const valid =
    topic &&
    taskKindOk &&
    q?.skill === "speaking" &&
    q.topic === topic &&
    q.taskKind === taskKindParam;

  const task = useMemo(() => {
    if (!valid || !q || q.skill !== "speaking") return null;
    return speakingTaskFromPractice(q, level);
  }, [valid, q, level]);

  function setLevelNav(next: Level) {
    setLevel(next);
    const qs = new URLSearchParams(searchParams.toString());
    qs.set("level", next);
    router.replace(
      `/practice/speaking/topics/${slug}/tasks/${taskKindParam}/questions/${questionId}?${qs.toString()}`,
      { scroll: false },
    );
  }

  const questionsListHref = `/practice/speaking/topics/${slug}/tasks/${taskKindParam}/questions`;

  return (
    <>
      <Navigation />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-4 flex flex-wrap gap-x-2 gap-y-1">
          <button type="button" onClick={() => router.push("/practice")} className="hover:text-blue-600 text-left">
            Practice
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => router.push("/practice/speaking/topics")}
            className="hover:text-blue-600 text-left"
          >
            Speaking
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => router.push(`/practice/speaking/topics/${slug}/tasks`)}
            className="hover:text-blue-600 text-left"
          >
            {topic ?? "Topic"}
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => router.push(questionsListHref)}
            className="hover:text-blue-600 text-left capitalize"
          >
            {taskKindParam}
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[10rem]" title={questionId}>
            Task
          </span>
        </nav>

        {!valid || !task ? (
          <p className="text-red-600">This question link is invalid or outdated.</p>
        ) : (
          <SpeakingPracticeSession
            task={task}
            level={level}
            onLevelChange={setLevelNav}
            onCancel={() => router.push(questionsListHref)}
            onLeaveAfterResult={() => router.push(questionsListHref)}
          />
        )}
      </main>
    </>
  );
}
