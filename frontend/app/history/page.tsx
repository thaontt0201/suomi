"use client";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { getHistory } from "@/lib/api";
import type { HistoryItem } from "@/lib/types";

const skillColor: Record<string, string> = {
  speaking: "bg-blue-100 text-blue-700",
  writing: "bg-purple-100 text-purple-700",
  vocabulary: "bg-green-100 text-green-700",
};

export default function HistoryPage() {
  const { data, isLoading } = useQuery<HistoryItem[]>({
    queryKey: ["history"],
    queryFn: getHistory,
  });

  return (
    <>
      <Navigation />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Practice History</h1>

        {isLoading && <p className="text-gray-400">Loading…</p>}
        {data?.length === 0 && <p className="text-gray-500">No practice sessions yet.</p>}

        <div className="flex flex-col gap-3">
          {data?.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border p-4 flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${skillColor[item.skill] ?? "bg-gray-100 text-gray-600"}`}>
                  {item.skill}
                </span>
                {item.type && <span className="text-sm text-gray-500 capitalize">{item.type}</span>}
              </div>
              <div className="flex gap-4 items-center">
                {item.score !== null && (
                  <span className="text-sm font-semibold text-gray-700">{item.score}/5</span>
                )}
                <span className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleDateString("fi-FI")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
