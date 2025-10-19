"use client";
import { motion } from "framer-motion";

export default function HomePage() {
  const cards = [
    { title: "Daily Lesson", text: "Warm up with a short practice tailored to you.", icon: "📚" },
    { title: "Recent Translations", text: "Review your latest signs and accuracy.", icon: "🔄" },
    { title: "Quick Start", text: "Jump straight into translator mode.", icon: "⚡" },
  ];
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}} className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4">Welcome Back!</h1>
        <p className="text-gray-300 text-lg">Continue your ASL learning journey</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <motion.div
            key={i}
            initial={{opacity:0,y:8}}
            animate={{opacity:1,y:0}}
            transition={{duration:.25, delay: i * 0.05}}
            whileHover={{ scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-gray-700 cursor-pointer hover:border-purple-500 transition-all"
          >
            <div className="text-4xl mb-3">{c.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{c.title}</h3>
            <p className="text-sm text-gray-300">{c.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
