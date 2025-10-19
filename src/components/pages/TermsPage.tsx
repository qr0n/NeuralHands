"use client";
import { motion } from "framer-motion";

export default function TermsPage({ back }: { back: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="card-surface rounded-2xl p-6 pb-24 shadow"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Terms of Service</h3>
        <button
          onClick={back}
          className="rounded-md px-3 py-1.5 text-sm outline-btn hover:bg-white/40 dark:hover:bg-white/10"
        >
          Back
        </button>
      </div>

      <ol className="ml-5 list-decimal space-y-3 text-sm opacity-80">
        <li>
          You must be 13+ and provide accurate registration information. You’re
          responsible for your account security.
        </li>
        <li>
          The app provides best-effort sign interpretation. Do not rely on it
          for life-critical communication.
        </li>
        <li>
          Content you upload or generate remains yours; you grant us a limited
          license to process it to deliver features (e.g., translation,
          practice, analytics).
        </li>
        <li>
          Prohibited uses: illegal content, reverse engineering, automated
          scraping, disrupting services.
        </li>
        <li>
          The service is provided “as is” without warranties. Our liability is
          limited to the extent permitted by law.
        </li>
      </ol>

      <p className="mt-6 text-xs opacity-60">
        Effective date: Oct 2025 — These terms may be updated with notice.
      </p>
    </motion.div>
  );
}
