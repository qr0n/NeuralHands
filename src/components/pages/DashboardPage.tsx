"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { apiFetchProgress } from "@/lib/api";

export default function DashboardPage({ userId }: { userId: string }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => { apiFetchProgress(userId).then(setData); }, [userId]);

  if (!data) return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}}
      className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 text-white">Loading…</motion.div>
  );

  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}} className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4">📊 Your Dashboard</h1>
        <p className="text-gray-300 text-lg">Track your ASL learning progress</p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700">
        <h3 className="text-2xl font-semibold text-white mb-6">Your Metrics</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Metric label="Lessons Completed" value={data.lessonsCompleted} />
          <Metric label="Current Streak" value={`${data.streakDays} days`} />
          <Metric label="Accuracy" value={`${Math.round(data.accuracy * 100)}%`} />
        </div>
        <div className="mt-6">
          <div className="mb-2 text-sm text-gray-300">Progress to next badge</div>
          <div className="h-3 w-full rounded bg-gray-700">
            <div 
              className="h-full rounded bg-gradient-to-r from-purple-500 to-pink-500" 
              style={{ width: `${Math.min(100, data.accuracy * 140)}%` }} 
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700">
        <h3 className="mb-4 text-2xl font-semibold text-white">🏆 Badges</h3>
        <div className="flex flex-wrap gap-2">
          {data.badges.map((b: string) => (
            <span key={b} className="rounded-full border border-purple-500 bg-purple-500/20 px-4 py-2 text-sm text-purple-200">
              {b}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-600 bg-gray-900/50 p-4">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}
