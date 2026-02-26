"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { getMe, getProgressSummary } from "@/lib/api";

export default function DashboardPage() {
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: getMe });
  const { data: progress } = useQuery({ queryKey: ["progress"], queryFn: getProgressSummary });

  return (
    <>
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Hei, {user?.name?.split(" ")[0] ?? "there"}! 👋
        </h1>
        <p className="text-gray-500 mb-8">Ready to practice Finnish today?</p>

        {progress && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-white rounded-xl border p-5">
              <div className="text-3xl font-bold text-blue-600">{progress.total_sessions}</div>
              <div className="text-gray-500 text-sm mt-1">Total sessions</div>
            </div>
            <div className="bg-white rounded-xl border p-5">
              <div className="text-3xl font-bold text-green-600">{progress.speaking.avg_score}/5</div>
              <div className="text-gray-500 text-sm mt-1">Speaking avg</div>
            </div>
            <div className="bg-white rounded-xl border p-5">
              <div className="text-3xl font-bold text-purple-600">{progress.level_estimate}</div>
              <div className="text-gray-500 text-sm mt-1">Estimated level</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {[
            { href: "/speaking", icon: "🎤", title: "Speaking Practice", desc: "Record and get AI feedback" },
            { href: "/writing", icon: "✍️", title: "Writing Practice", desc: "Write and get evaluated" },
            { href: "/vocabulary", icon: "📚", title: "Vocabulary", desc: "Flashcards and quizzes" },
            { href: "/progress", icon: "📊", title: "Progress", desc: "Track your improvements" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow flex gap-4 items-start"
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
