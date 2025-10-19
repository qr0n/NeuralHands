"use client";
import { motion } from "framer-motion";

export default function TutorialPage({ back }: { back?: () => void }) {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}}
      className="card-surface rounded-2xl p-6 pb-24 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tutorials</h3>
        {back && (
          <button onClick={back} className="rounded-md px-3 py-1.5 text-sm outline-btn hover:bg-white/40 dark:hover:bg-white/10">
            Back
          </button>
        )}
      </div>
      <p className="text-sm opacity-80">Video tutorials for Web, Mac, Windows, Android, and iOS will be posted here.</p>
    </motion.div>
  );
}
