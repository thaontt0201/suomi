interface ScoreCardProps {
  score: number;
  levelEstimate: string;
  maxScore?: number;
}

export default function ScoreCard({ score, levelEstimate, maxScore = 5 }: ScoreCardProps) {
  const pct = Math.round((score / maxScore) * 100);
  const color = pct >= 80 ? "text-green-600" : pct >= 50 ? "text-yellow-600" : "text-red-600";
  return (
    <div className="flex items-center gap-6 bg-white rounded-xl border p-5">
      <div className={`text-5xl font-bold ${color}`}>{score}/{maxScore}</div>
      <div>
        <div className="text-gray-500 text-sm">Estimated level</div>
        <div className="text-2xl font-semibold text-blue-700">{levelEstimate}</div>
      </div>
    </div>
  );
}
