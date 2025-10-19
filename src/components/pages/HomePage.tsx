"use client";
import { motion } from "framer-motion";

export default function HomePage() {
  const cards = [
    { title: "Daily Lesson", text: "Warm up with a short practice tailored to you." },
    { title: "Recent Translations", text: "Review your latest signs and accuracy." },
    { title: "Quick Start", text: "Jump straight into translator mode." },
  ];
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}} className="space-y-6 pb-24">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{opacity:0,y:8}}
          animate={{opacity:1,y:0}}
          transition={{duration:.25, delay: i * 0.05}}
          className="card-surface rounded-2xl p-6 shadow"
        >
          <h3 className="text-lg font-semibold">{c.title}</h3>
          <p className="mt-1 text-sm opacity-80">{c.text}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
