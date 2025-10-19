"use client";

import { motion } from "framer-motion";

interface GeminiFeedback {
  signs_detected: Array<{
    sign: string;
    sequence_position: string;
    feedback: string | {
      what_they_did_well?: string;
      improvements_needed?: string;
    };
  }>;
  detailed_feedback: string;
  summary: string;
}

interface GeminiFeedbackDisplayProps {
  feedback: GeminiFeedback;
  showSummary: boolean;
}

export default function GeminiFeedbackDisplay({
  feedback,
  showSummary,
}: GeminiFeedbackDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="card-surface mt-6 rounded-2xl p-6 shadow-xl"
    >
      {/* Signs Detected Section */}
      <div className="mb-6">
        <h3 className="mb-4 text-xl font-bold text-yellow-400">
          🤟 Signs Detected
        </h3>

        {feedback.signs_detected && feedback.signs_detected.length > 0 ? (
          <div className="space-y-3">
            {feedback.signs_detected.map((sign, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border-l-4 border-yellow-400 bg-white/5 p-4 backdrop-blur"
                >
                  <div className="mb-1 text-lg font-bold text-yellow-400">
                    {sign.sign}
                  </div>
                  <div className="mb-2 text-xs italic opacity-70">
                    {sign.sequence_position}
                  </div>
                  <div className="text-sm leading-relaxed opacity-90">
                    {/* Handle both string and object feedback formats */}
                    {typeof sign.feedback === 'string' ? (
                      <div>{sign.feedback}</div>
                    ) : (
                      <>
                        {sign.feedback.what_they_did_well && (
                          <div className="mb-2">
                            <span className="font-semibold text-green-400">✓ What you did well:</span>
                            <span className="ml-2">{sign.feedback.what_they_did_well}</span>
                          </div>
                        )}
                        {sign.feedback.improvements_needed && (
                          <div>
                            <span className="font-semibold text-orange-400">→ Improvements:</span>
                            <span className="ml-2">{sign.feedback.improvements_needed}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl bg-white/5 p-4 text-center text-sm opacity-70">
            No signs detected in this sequence.
          </div>
        )}
      </div>

      {/* Overall Feedback Section */}
      <div>
        <h3 className="mb-4 text-xl font-bold text-yellow-400">
          💬 Overall Feedback
        </h3>

        <motion.div
          key={showSummary ? "summary" : "detailed"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-5 leading-relaxed"
        >
          <p className="whitespace-pre-wrap text-sm">
            {showSummary ? feedback.summary : feedback.detailed_feedback}
          </p>
        </motion.div>
      </div>

      {/* Helpful tip */}
      <div className="mt-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-xs">
        <span className="font-semibold">💡 Tip:</span> Use the "Show Summary"
        button to toggle between detailed and brief feedback.
      </div>
    </motion.div>
  );
}
