"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { apiFetchProgress } from "@/lib/api";

export default function DashboardPage({ userId }: { userId: string }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => { apiFetchProgress(userId).then(setData); }, [userId]);

  if (!data) return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}}
      className="card-surface rounded-2xl p-6">Loading…</motion.div>
  );

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}} className="space-y-6 pb-24">
      <div className="card-surface rounded-2xl p-6 shadow">
        <h3 className="text-lg font-semibold">Your Metrics</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Metric label="Lessons Completed" value={data.lessonsCompleted} />
          <Metric label="Current Streak" value={`${data.streakDays} days`} />
          <Metric label="Accuracy" value={`${Math.round(data.accuracy * 100)}%`} />
        </div>
        <div className="mt-6">
          <div className="mb-2 text-sm opacity-80">Progress to next badge</div>
          <div className="h-3 w-full rounded bg-purple-100 dark:bg-purple-950/50">
            <div className="h-full rounded" style={{ background: "var(--primary-700)", width: `${Math.min(100, data.accuracy * 140)}%` }} />
          </div>
        </div>
      </div>

      <div className="card-surface rounded-2xl p-6 shadow">
        <h3 className="mb-2 text-lg font-semibold">Badges</h3>
        <div className="flex flex-wrap gap-2">
          {data.badges.map((b: string) => (
            <span key={b} className="rounded-full border px-3 py-1 text-xs">{b}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-xs opacity-70">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
