"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}} className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4">ℹ️ About Neural Hand</h1>
        <p className="text-gray-300 text-lg">Learn about our mission and technology</p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700">
        <h3 className="text-2xl font-semibold text-white mb-3">How it works</h3>
        <p className="text-sm text-gray-300">Camera detects hand landmarks using MediaPipe, ML classifies signs with custom models, and you get instant personalized feedback from Google Gemini AI.</p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700">
        <h3 className="text-2xl font-semibold text-white mb-3">Who it benefits</h3>
        <p className="text-sm text-gray-300">Learners wanting to master ASL, educators teaching sign language, and accessibility advocates promoting inclusive communication.</p>
      </div>

      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700">
        <h3 className="text-2xl font-semibold text-white mb-3">Why it was made</h3>
        <p className="text-sm text-gray-300 mb-4">To make ASL learning interactive, accessible, and personalized for everyone through the power of AI and computer vision.</p>
        <div className="text-xs text-gray-400 border-t border-gray-700 pt-4">
          <div className="font-semibold text-purple-400">Version 0.2.0</div>
          <div className="mt-2">Roadmap: Advanced lessons, offline mode enhancements, improved feedback, and progress tracking.</div>
        </div>
      </div>
    </motion.div>
  );
}
