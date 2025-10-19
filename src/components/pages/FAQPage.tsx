"use client";
import { motion } from "framer-motion";

export default function FAQPage({ goContact, back }: { goContact: () => void; back?: () => void }) {
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}}
      className="space-y-4 card-surface rounded-2xl p-6 pb-24 shadow">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">FAQ</h3>
        {back && (
          <button onClick={back} className="rounded-md px-3 py-1.5 text-sm outline-btn hover:bg-white/40 dark:hover:bg-white/10">
            Back
          </button>
        )}
      </div>
      <div>
        <div className="font-medium">Is my data private?</div>
        <p className="text-sm opacity-80">We store only what's necessary to power your experience.</p>
      </div>
      <div>
        <div className="font-medium">Will you support more languages?</div>
        <p className="text-sm opacity-80">Yes—coming soon.</p>
      </div>
      <motion.button whileTap={{scale:.98}} onClick={goContact}
        className="rounded-lg px-4 py-2 text-sm text-white" style={{background:"var(--primary-700)"}}>
        Contact Support
      </motion.button>
    </motion.div>
  );
}
