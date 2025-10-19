"use client";

export default function OnboardingWizard({
  onFinishToDashboard,
  onFinishToTranslator,
}: {
  onFinishToDashboard: () => void;
  onFinishToTranslator: () => void;
}) {
  const steps = [
    { title: "Welcome!", text: "This 4-step tour shows how to use Neural Hands." },
    { title: "Translator", text: "Use your camera to translate signs to text." },
    { title: "Lessons", text: "Practice guided modules and track your progress." },
    { title: "All set!", text: "Choose where to start below." },
  ];

  const progressWidth = (idx: number) => `${((idx + 1) / steps.length) * 100}%`;

  return (
    <WizardInner steps={steps} onFinishToDashboard={onFinishToDashboard} onFinishToTranslator={onFinishToTranslator} progressWidth={progressWidth} />
  );
}

import { useState } from "react";
function WizardInner({
  steps,
  onFinishToDashboard,
  onFinishToTranslator,
  progressWidth,
}: any) {
  const [idx, setIdx] = useState(0);

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-2xl border bg-white/80 p-6 shadow-xl backdrop-blur dark:bg-black/50">
      <div className="mb-4 h-1.5 w-full rounded bg-gray-200 dark:bg-gray-700">
        <div className="h-full rounded bg-black transition-all dark:bg-white" style={{ width: progressWidth(idx) }} />
      </div>
      <h2 className="mb-2 text-xl font-semibold">{steps[idx].title}</h2>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">{steps[idx].text}</p>

      <div className="flex justify-between">
        <button
          onClick={() => setIdx((v: number) => Math.max(0, v - 1))}
          className={`rounded-lg px-4 py-2 text-sm ${idx === 0 ? "invisible" : "border hover:bg-gray-50 dark:hover:bg-white/10"}`}
        >
          ← Previous
        </button>

        {idx < steps.length - 1 ? (
          <button
            onClick={() => setIdx((v: number) => Math.min(steps.length - 1, v + 1))}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90 dark:bg-white dark:text-black"
          >
            Next →
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onFinishToDashboard}
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/10"
            >
              Start Practice
            </button>
            <button
              onClick={onFinishToTranslator}
              className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:opacity-90 dark:bg-white dark:text-black"
            >
              Go to Translator
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
