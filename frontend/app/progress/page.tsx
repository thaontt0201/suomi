"use client";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { getProgressSummary } from "@/lib/api";
import type { ProgressSummary } from "@/lib/types";

export default function ProgressPage() {
  const { data, isLoading } = useQuery<ProgressSummary>({
    queryKey: ["progress"],
    queryFn: getProgressSummary,
  });

  return (
    <>
      <Navigation />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Progress Analytics</h1>

        {isLoading && <p className="text-gray-400">Loading…</p>}

        {data && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border p-5 text-center">
                <div className="text-4xl font-bold text-blue-600">{data.total_sessions}</div>
                <div className="text-gray-500 text-sm mt-1">Total Sessions</div>
              </div>
              <div className="bg-white rounded-xl border p-5 text-center">
                <div className="text-4xl font-bold text-green-600">{data.speaking.avg_score}</div>
                <div className="text-gray-500 text-sm mt-1">Speaking Avg</div>
              </div>
              <div className="bg-white rounded-xl border p-5 text-center">
                <div className="text-4xl font-bold text-purple-600">{data.level_estimate}</div>
                <div className="text-gray-500 text-sm mt-1">CEFR Level</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border p-5">
                <h2 className="font-semibold text-gray-700 mb-3">Speaking ({data.speaking.count} sessions)</h2>
                <div className="space-y-2">
                  {data.speaking.recent_scores.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(s.score / 5) * 100}%` }} />
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">{s.score}/5</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border p-5">
                <h2 className="font-semibold text-gray-700 mb-3">Writing ({data.writing.count} sessions)</h2>
                <div className="space-y-2">
                  {data.writing.recent_scores.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(s.score / 5) * 100}%` }} />
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">{s.score}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
