"use client";
import { motion } from "framer-motion";

export default function PrivacyPage({ back }: { back: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="card-surface rounded-2xl p-6 pb-24 shadow"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Privacy Policy</h3>
        <button
          onClick={back}
          className="rounded-md px-3 py-1.5 text-sm outline-btn hover:bg-white/40 dark:hover:bg-white/10"
        >
          Back
        </button>
      </div>

      <p className="text-sm opacity-80">
        We collect only the minimum data needed to provide translation, practice,
        and progress features. Video frames are processed in real time and are
        not stored by default. When you opt in to cloud analysis or practice
        feedback, anonymized features (e.g., hand landmarks or model outputs)
        may be sent to our servers for inference and improvement.
      </p>

      <h4 className="mt-6 font-medium">Data we may process</h4>
      <ul className="ml-5 list-disc text-sm opacity-80">
        <li>Account info: email, username, password hash</li>
        <li>Usage: session timestamps, feature toggles (local/cloud)</li>
        <li>
          Practice metrics: accuracy, streaks, badges, feedback you submit
        </li>
        <li>
          Optional: camera device id (non-unique), browser/OS for debugging
        </li>
      </ul>

      <h4 className="mt-6 font-medium">Your choices</h4>
      <ul className="ml-5 list-disc text-sm opacity-80">
        <li>Use Local (offline) model for letters/numbers without network.</li>
        <li>Disable saving progress if you prefer not to store metrics.</li>
        <li>Request data export or deletion at any time via Contact Support.</li>
      </ul>

      <h4 className="mt-6 font-medium">Security</h4>
      <p className="text-sm opacity-80">
        We follow best practices for credential storage and transport
        encryption. Access to production data is strictly controlled.
      </p>

      <p className="mt-6 text-xs opacity-60">
        Effective date: Oct 2025 — This document may be updated as features
        evolve.
      </p>
    </motion.div>
  );
}
