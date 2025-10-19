"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}} className="space-y-6 pb-24">
      <div className="card-surface rounded-2xl p-6 shadow">
        <h3 className="text-lg font-semibold">How it works</h3>
        <p className="mt-2 text-sm opacity-80">Camera detects hand landmarks, ML classifies signs, and you get instant feedback.</p>
      </div>
      <div className="card-surface rounded-2xl p-6 shadow">
        <h3 className="text-lg font-semibold">Who it benefits</h3>
        <p className="mt-2 text-sm opacity-80">Learners, educators, and accessibility advocates.</p>
      </div>
      <div className="card-surface rounded-2xl p-6 shadow">
        <h3 className="text-lg font-semibold">Why it was made</h3>
        <p className="mt-2 text-sm opacity-80">To make ASL learning interactive and accessible.</p>
        <div className="mt-4 text-xs opacity-60">Version 0.2.0 • Roadmap: Lessons v2, offline cache, better tips.</div>
      </div>
    </motion.div>
  );
}
